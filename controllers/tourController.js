const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// Configuring multer
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) return cb(null, true);
  cb(new AppError('Not an image! Please upload an image.', 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImageCover = upload.single('imageCover');

exports.resizeTourImageCover = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `tour-${req.body.name}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.file.filename}`);

  next();
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
  if (typeof req.body.guides === 'string') {
    req.body.guides = req.body.guides.split(',');
  } else if (!req.body.guides) {
    req.body.guides = [];
  }

  if (req.file) {
    req.body.imageCover = req.file.filename;
  }

  if (req.body.locations) {
    const locations = JSON.parse(req.body.locations);

    formatedLocations = locations.map((item) => {
      return {
        coordinates: [Number(item.longtitude), Number(item.latitude)],
        description: item.description,
        day: Number(item.day),
      };
    });

    req.body.locations = formatedLocations;
  }

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

exports.updateTour = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;

  if (req.body.guides && typeof req.body.guides === 'string') {
    req.body.guides = req.body.guides.split(',');
  } else if (!req.body.guides) {
    req.body.guides = [];
  }

  if (req.file) {
    req.body.imageCover = req.file.filename;
  }

  if (req.body.locations) {
    const locations = JSON.parse(req.body.locations);

    formatedLocations = locations.map((item) => {
      return {
        coordinates: [Number(item.longtitude), Number(item.latitude)],
        description: item.description,
        day: Number(item.day),
      };
    });

    req.body.locations = formatedLocations;
  }

  const tour = await Tour.findByIdAndUpdate(tourId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that id', 400));
  }

  res.status(201).json({
    status: 'success',
    message: 'Updated tour successfully',
    data: tour,
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;

  await Tour.findByIdAndDelete(tourId);

  res.status(201).json({
    status: 'success',
    message: 'Deleted tour successfully',
  });
});
