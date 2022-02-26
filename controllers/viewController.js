const Tour = require('../models/tourModel');
const User = require('../models/userModel');

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

exports.getManageToursView = async (req, res, next) => {
  const tours = await Tour.find({});
  res.status(200).render('manage-tours/manage-tours-view', {
    title: 'Manage Tours',
    user: req.user,
    tours,
    pathname: req.path,
  });
};

exports.getTourForm = async (req, res, next) => {
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

  res.status(200).render('manage-tours/tour-detail-form', {
    title: tour.name,
    tour,
    selectedGuides,
    restOfTourGuides,
    pathname: req.path,
  });
};

exports.getAddNewTourForm = async (req, res, next) => {
  const guides = await User.find({
    $or: [{ role: 'guide' }, { role: 'lead-guide' }],
  });

  res.status(200).render('manage-tours/add-new-tour', {
    title: 'Add New Tour',
    guides,
    pathname: req.path,
  });
};

exports.getManageUsersView = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).render('manage-users/manage-users-view', {
    title: 'Manage Users',
    user: req.user,
    users,
    pathname: req.path,
  });
};

exports.getUserForm = async (req, res, next) => {
  const selectedUser = await User.findById(req.params.userId);

  res.status(200).render('manage-users/user-detail-form', {
    title: selectedUser.name,
    user: req.user,
    selectedUser,
    pathname: req.path,
  });
};

exports.getAddNewUserForm = (req, res) => {
  res.status(200).render('manage-users/add-new-user', {
    title: 'Add New User',
    pathname: req.path,
  });
};
