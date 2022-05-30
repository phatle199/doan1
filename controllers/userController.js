const bcrypt = require('bcrypt');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
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

exports.uploadUserImage = upload.single('photo');

exports.resizeUserImage = async (req, res, next) => {
  if (!req.file) return next();

  // nếu update user không update email thì chạy query tìm email của user đang được update
  const email = req.body.email || (await User.findById(req.params.id)).email;

  req.file.filename = `user-${email}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

// Lọc bỏ các cột người dùng không được phép thay đổi
const filterUpdateFields = (filterObject, ...allowedFields) => {
  const filteredObject = {};
  allowedFields.forEach((el) => (filteredObject[el] = filterObject[el]));
  return filteredObject;
};

exports.updateMyData = catchAsync(async (req, res, next) => {
  console.log(req.body);
  // Check if user update password with this route
  if (req.body.password) {
    return next(
      new AppError(
        'You can not change password by this route. Try /update-my-password.',
        400
      )
    );
  }

  // Filter update fields
  const filteredObject = filterUpdateFields(
    req.body,
    'name',
    'email',
    'phoneNumber'
  );

  // Update photo
  if (req.file) {
    filteredObject.photo = req.file.filename;
  }

  // Update user data
  const user = await User.findByIdAndUpdate(req.user._id, filteredObject, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(201).json({
    status: 'success',
    user,
  });
});

exports.getPasswordPhoto = async (req, res, next) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 12);
    req.body.passwordChangedAt = Date.now();
  }

  if (req.file) {
    req.body.photo = req.file.filename;
  }
  next();
};

exports.getPhoto = async (req, res, next) => {
  if (req.file) {
    req.body.photo = req.file.filename;
  }

  next();
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
