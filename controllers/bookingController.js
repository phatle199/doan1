const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./../controllers/handlerFactory');
const AppError = require('../utils/AppError');

exports.checkIfThereAreTicketsAvailable = catchAsync(async (req, res, next) => {
  // 1. Lấy tour đang được đặt
  const tour = await Tour.findById(req.params.tourId ?? req.body.tour);

  // 2. Lấy số lượng vé tối đa
  const maxGroupSize = tour.maxGroupSize;

  // 3. Lấy số vé đang đặt
  const ticketsQuantity = Number(
    req.body.ticketsQuantity ?? req.params.ticketsQuantity
  );

  // 4. Lấy số lượng vé tour này đã được đặt
  const numberOfTicketsBooked =
    (
      await Booking.aggregate([
        {
          $match: { tour: tour._id },
        },
        {
          $group: {
            _id: null,
            numberOfTicketsBooked: { $sum: '$ticketsQuantity' },
          },
        },
      ])
    )[0]?.numberOfTicketsBooked ?? 0;

  // 5. Nếu số vé được đặt + số vé tour đã dược đặt > số lượng thành viên tôi đa của tour => ko cho đặt nữa
  if (numberOfTicketsBooked + ticketsQuantity > maxGroupSize) {
    const numberOfTicketsAvailable = maxGroupSize - numberOfTicketsBooked;
    const msg =
      numberOfTicketsAvailable === 0
        ? 'Tour này đã bán hết vé.'
        : `Hiện chỉ còn ${numberOfTicketsAvailable} vé.`;

    return next(new AppError(`Đặt tour thất bại. ${msg}`, 400));
  }

  req.body.ticketsQuantity = ticketsQuantity;
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
        amount: tour.price * 100 * req.body.ticketsQuantity,
        currency: 'usd',
        quantity: req.body.ticketsQuantity,
      },
    ],
  });

  session.ticketsQuantity = req.body.ticketsQuantity;

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
  const price = await Tour.findById(tour).price;
  const ticketsQuantity = session.ticketsQuantity;

  await Booking.create({ tour, user, phoneNumber, price, ticketsQuantity });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  console.log(signature);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_KEY
    );
  } catch (err) {
    console.log(err);
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
