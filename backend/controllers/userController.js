const bcrypt = require('bcrypt');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
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

exports.uploadUserImage = upload.single('photo');

exports.resizeUserImage = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

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
  const filteredObject = filterUpdateFields(req.body, 'name', 'email');

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

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  if (!users) {
    return next(new AppError('No users found', 400));
  }

  res.status(200).json({
    status: 'success',
    results: users.length,
    users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return new AppError('No user found with that id', 400);
  }

  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  console.log(req.body);

  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 12);
    req.body.passwordChangedAt = Date.now();
  }

  if (req.file) {
    req.body.photo = req.file.filename;
  }

  const user = await User.findByIdAndUpdate(userId, req.body);

  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  await User.findByIdAndDelete(userId);

  res.status(200).json({
    status: 'success',
  });
});
