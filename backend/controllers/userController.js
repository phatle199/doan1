const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

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

  if (req.body.password) {
    req.body.passwordChangedAt = Date.now();
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
