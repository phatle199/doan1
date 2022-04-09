const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
const AppError = require('../utils/AppError');
const factory = require('./handlerFactory');

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

exports.getGuidesImageCoverLocations = (req, res, next) => {
  if (req.body.guides && typeof req.body.guides === 'string') {
    req.body.guides = req.body.guides.split(',');
  } else if (req.body.guides === '') {
    req.body.guides = [];
  }

  if (req.file) {
    req.body.imageCover = req.file.filename;
  }

  if (req.body.locations && typeof req.body.locations === 'string') {
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

  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
