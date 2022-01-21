const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');
const AppError = require('../utils/AppError');

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // Excute query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  if (!tours) {
    return next(new AppError('No tours found', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'Get all tours successfully',
    results: tours.length,
    data: tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const tour = await Tour.findById(tourId);

  if (!tour) {
    return next(new AppError('No tour found with that id', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'Get a tour by id successfully',
    data: tour,
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);

  if (!tour) {
    return next(
      new AppError('Created tour unsucessfully. Please try again later!')
    );
  }

  res.status(201).json({
    status: 'success',
    message: 'Created tour successfully',
    data: tour,
  });
});

exports.updateTour = async (req, res, next) => {
  try {
    const { tourId } = req.params;

    const tour = await Tour.findByIdAndUpdate(tourId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: 'success',
      message: 'Updated tour successfully',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteTour = async (req, res, next) => {
  try {
    const { tourId } = req.params;

    await Tour.findByIdAndDelete(tourId);

    res.status(201).json({
      status: 'success',
      message: 'Deleted tour successfully',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
