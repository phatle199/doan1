const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, photo } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  user.password = undefined;

  const json = generateToken(user._id);

  res.status(201).json({
    status: 'success',
    user,
    json,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user hasn't sent email and password yet
  if (!email || !password) {
    return next(new AppError('Please provide your email and password', 400));
  }

  // Getting user by email
  const user = await User.findOne({ email }).select('password');

  // Check if password is correct or user is not exists
  if (
    !user ||
    !(await user.enteredPasswordIsCorrect(password, user.password))
  ) {
    return next(
      new AppError(
        'Your email or password is incorrect. Please try again!',
        401
      )
    );
  }

  // Generate and send token
  const json = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    json,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // Check if user hasn't logged in
  let token = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please login to get access', 401)
    );
  }

  // Verify jwt
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('User belongs to this token has no longer existed', 401)
    );
  }

  // Check if user changed password after jwt was issued
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError('User belongs to this token has changed password', 401)
    );
  }

  req.user = currentUser;
  next();
});
