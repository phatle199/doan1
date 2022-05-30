const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./../controllers/handlerFactory');
const AppError = require('../utils/AppError');

exports.checkIfThereAreTicketsAvailable = catchAsync(async (req, res, next) => {
  // 1. Lấy số lượng vé tối đa
  const maxGroupSize = (await Tour.findById(req.params.tourId ?? req.body.tour))
    .maxGroupSize;
  console.log(maxGroupSize);
  // 2. Lấy số lượng vé tour này đã được đặt
  const numberOfTicketsBooked = await Booking.countDocuments({
    tour: req.params.tourId ?? req.body.tour,
  });

  // 3. Nếu số vé đã bán bằng hoặc lớn hơn số vé tối đa => ko cho đặt nữa
  if (numberOfTicketsBooked >= maxGroupSize) {
    return next(
      new AppError('Booked tour unsuccessfull. Out of tickets!', 400)
    );
  }

  next();
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. Lấy tour đang được đặt
  const tour = await Tour.findById(req.params.tourId);

  // 2. Tạo checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get('host')}?tour=${tour._id}&user=${
    //   req.user._id
    // }&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get(
      'host'
    )}/me/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour._id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
        ],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  // 3. Gửi session đi
  res.status(200).json({
    status: 'success',
    session,
  });
});

// // Tạo booking mới khi đặt tour thành công
// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   const { tour, user, price } = req.query;

//   if (!tour || !user || !price) return next();

//   await Booking.create({ tour, user, price });

//   res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = async (session) => {
  const currentUser = await User.findOne({ email: session.customer_email });
  const tour = session.client_reference_id;
  const user = currentUser._id;
  const phoneNumber = currentUser.phoneNumber;
  const price = session.amount_total / 100;
  await Booking.create({ tour, user, phoneNumber, price });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_KEY
    );
  } catch (err) {
    res.status(200).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
