const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');

exports.getAllTours = async (req, res, next) => {
  try {
    // Excute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      message: 'Get all tours successfully',
      results: tours.length,
      data: tours,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res, next) => {
  try {
    const { tourId } = req.params;
    const tour = await Tour.findById(tourId);

    res.status(200).json({
      status: 'success',
      message: 'Get a tour by id successfully',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.createTour = async (req, res, next) => {
  try {
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
