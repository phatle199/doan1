const Tour = require('../models/tourModel');

exports.createTour = async (req, res, next) => {
  try {
    console.log(req.body);
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Created tour successfully',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
