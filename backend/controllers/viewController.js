const Tour = require('../models/tourModel');

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
  res.status(200).render('login', {
    title: 'Login',
  });
};

exports.getMe = (req, res, next) => {
  res.status(200).render('me', {
    title: req.user.name,
    user: req.user,
  });
};
