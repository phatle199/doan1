const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/APIFeatures');
const AppError = require('../utils/AppError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') res.locals.alert = 'Đặt tour thành công!.';
  next();
};

exports.getOverview = async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
};

exports.getTour = async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('No tour found with that id.', 404));
  }

  let currentUserDidNotReviewYet = true;

  if (req.user) {
    const review = await Review.findOne({ tour: tour._id, user: req.user._id });
    if (review) currentUserDidNotReviewYet = false;
  }

  res.status(200).render('tour', {
    title: tour.name,
    tour,
    currentUserDidNotReviewYet,
  });
};

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('auth/login', {
    title: 'Login',
    pathname: req.path,
    server: 1,
  });
};

exports.getSignupForm = (req, res, next) => {
  res.status(200).render('auth/signup', {
    title: 'Signup',
    pathname: req.path,
    server: 1,
  });
};

exports.getMe = (req, res, next) => {
  res.status(200).render('settings', {
    title: req.user.name,
    user: req.user,
    pathname: req.path,
    server: 1,
  });
};

exports.getMyTours = async (req, res, next) => {
  // 1. Lấy tất cả bookings thuộc về người dùng đang đăng nhập
  const bookings = await Booking.find({ user: req.user.id });

  // 2. Lấy ra các tours
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res
    .status(200)
    .render('overview', { title: 'My tours', tours, pathname: req.path });
};

exports.getMyReviews = async (req, res, next) => {
  // Lấy tất cả bookings thuộc về người dùng đang đăng nhập
  const reviews = await Review.find({ user: req.user.id }).populate({
    path: 'tour',
    select: 'name',
  });

  res.status(200).render('my-reviews', {
    title: 'My reviews',
    reviews,
    pathname: req.path,
    server: 1,
  });
};

// TOUR
exports.getToursList = async (req, res, next) => {
  if (!req.query.page) req.query.page = 1;
  const numberOfTours = await Tour.count();

  const features = new APIFeatures(Tour.find({}), req.query).paginate();

  const tours = await features.query;

  res.status(200).render('manage-tours/list', {
    title: 'Manage Tours',
    user: req.user,
    tours,
    pathname: req.path,
    pageSize: Math.ceil(numberOfTours / 5),
    currentPage: Number(req.query.page),
    server: 1,
  });
};

exports.getUpdateTourForm = async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId).populate('guides');
  const guides = await User.find({
    $or: [{ role: 'guide' }, { role: 'lead-guide' }],
  });

  // Get selected guides on a tour
  let selectedGuides = [];
  tour.guides.forEach((guide) => {
    selectedGuides.push(guide);
  });

  // Get the rest of the tour guides
  const selectedGuideNames = selectedGuides.map((guide) => guide.name);
  const restOfTourGuides = [];
  guides.forEach((guide) => {
    if (!selectedGuideNames.includes(guide.name)) restOfTourGuides.push(guide);
  });

  res.status(200).render('manage-tours/update', {
    title: tour.name,
    tour,
    selectedGuides,
    restOfTourGuides,
    pathname: req.path,
    server: 1,
  });
};

exports.getCreateTourForm = async (req, res, next) => {
  const guides = await User.find({
    $or: [{ role: 'guide' }, { role: 'lead-guide' }],
  });

  res.status(200).render('manage-tours/add', {
    title: 'Add New Tour',
    guides,
    pathname: req.path,
    server: 1,
  });
};

// USERS
exports.getUsersList = async (req, res, next) => {
  if (!req.query.page) req.query.page = 1;
  const numberOfTours = await User.count();
  const features = new APIFeatures(User.find({}), req.query).paginate();

  const users = await features.query;

  res.status(200).render('manage-users/list', {
    title: 'Manage Users',
    user: req.user,
    users,
    pathname: req.path,
    pageSize: Math.ceil(numberOfTours / 5),
    currentPage: Number(req.query.page),
    server: 1,
  });
};

exports.getUpdateUserForm = async (req, res, next) => {
  const selectedUser = await User.findById(req.params.userId);

  res.status(200).render('manage-users/update', {
    title: selectedUser.name,
    user: req.user,
    selectedUser,
    pathname: req.path,
    server: 1,
  });
};

exports.getCreateUserForm = (req, res) => {
  res.status(200).render('manage-users/add', {
    title: 'Add New User',
    pathname: req.path,
    server: 1,
  });
};
