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

exports.uploadImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeUploadImages = async (req, res, next) => {
  console.log(req.files);
  if (!req.files) {
    return next();
  }

  // resize and storage image cover
  if (req.files['imageCover']) {
    const imageCoverFileName = `tour-imageCover-${
      req.body.name
    }-${Date.now()}.jpeg`;

    req.body.imageCover = imageCoverFileName;

    await sharp(req.files['imageCover'][0].buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${imageCoverFileName}`);
  }

  // resize and storage images
  if (req.files['images']) {
    req.body.images = [];
    await Promise.all(
      req.files['images'].map(async (file, i) => {
        const newFilename = `tour-images-${i + 1}-${
          req.body.name
        }-${Date.now()}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${newFilename}`);
        req.body.images.push(newFilename);
      })
    );
  }

  next();
};

exports.getGuidesLocationsStartDates = (req, res, next) => {
  if (req.body.guides && typeof req.body.guides === 'string') {
    req.body.guides = req.body.guides.split(',');
  } else if (req.body.guides === '') {
    req.body.guides = [];
  }

  if (req.body.locations && typeof req.body.locations === 'string') {
    const locations = JSON.parse(req.body.locations);
    const startDates = JSON.parse(req.body.startDates);

    formatedLocations = locations.map((item) => {
      return {
        coordinates: [Number(item.longtitude), Number(item.latitude)],
        description: item.description,
        day: Number(item.day),
      };
    });

    req.body.locations = formatedLocations;
    req.body.startDates = startDates;
  }

  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
