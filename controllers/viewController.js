const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const APIFeatures = require('../utils/APIFeatures');

exports.getOverview = async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
};

exports.getTour = async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
};

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('auth/login', {
    title: 'Login',
    pathname: req.path,
  });
};

exports.getSignupForm = (req, res, next) => {
  res.status(200).render('auth/signup', {
    title: 'Signup',
    pathname: req.path,
  });
};

exports.getMe = (req, res, next) => {
  res.status(200).render('settings', {
    title: req.user.name,
    user: req.user,
    pathname: req.path,
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
  });
};

exports.getCreateTourForm = async (req, res, next) => {
  const guides = await User.find({
    $or: [{ role: 'guide' }, { role: 'lead-guide' }],
  });

  res.status(200).render('manage-tours/create', {
    title: 'Add New Tour',
    guides,
    pathname: req.path,
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
  });
};

exports.getUpdateUserForm = async (req, res, next) => {
  const selectedUser = await User.findById(req.params.userId);

  res.status(200).render('manage-users/update', {
    title: selectedUser.name,
    user: req.user,
    selectedUser,
    pathname: req.path,
  });
};

exports.getCreateUserForm = (req, res) => {
  res.status(200).render('manage-users/add', {
    title: 'Add New User',
    pathname: req.path,
  });
};
