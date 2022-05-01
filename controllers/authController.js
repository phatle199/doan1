const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Email = require('../utils/email');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, res, statusCode) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  user.password = undefined;

  await new Email(
    user,
    `${req.protocol}://${req.get('host')}/me`
  ).sendWelcome();

  createAndSendToken(user, res, 201);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user hasn't sent email and password yet
  if (!email || !password) {
    return next(new AppError('Please provide your email and password', 400));
  }

  // Getting user by email
  const user = await User.findOne({ email }).select('+password');

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
  createAndSendToken(user, res, 200);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() - 3 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
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
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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

  res.locals.user = currentUser;
  req.user = currentUser;
  next();
});

// Only for rendered pages
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    // Verify jwt
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }

    // Check if user changed password after jwt was issued
    if (currentUser.passwordChangedAfter(decoded.iat)) {
      return next();
    }

    res.locals.user = currentUser;
    return next();
  }

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 401)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  // 1. Getting user by email and check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('No user found with that email', 400));
  }

  // 2. Create reset password token
  const resetPasswordToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send reset password token to user
  try {
    const resetPasswordUrl = `${req.protocol}://${req.get(
      'host'
    )}/reset-password/${resetPasswordToken}`;

    await new Email(user, resetPasswordUrl).sendResetPassword();

    // 4. Response
    res.status(200).json({
      status: 'success',
      message: 'Token was sent to your email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.log(err);

    res.status(500).json({
      status: 'error',
      message: 'Could not send email. Please try again later.',
    });
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Getting and hash resetPasswordToken
  let { resetPasswordToken } = req.params;
  resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetPasswordToken)
    .digest('hex');

  // Getting user via resetPasswordToken
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpiresIn: { $gt: Date.now() },
  });

  // Check if resetPasswordToken was expired or invalid
  if (!user) {
    return next(
      new AppError(
        'Your reset password token was expired or invalid. Please try again!',
        401
      )
    );
  }

  // Set new password
  const { password, passwordConfirm } = req.body;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiresIn = undefined;
  await user.save();

  // Log the user in
  createAndSendToken(user, res, 200);
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, password, passwordConfirm } = req.body;
  const user = await User.findOne({ email: req.user.email }).select('password');

  if (!(await user.enteredPasswordIsCorrect(passwordCurrent, user.password))) {
    return next(
      new AppError('Your current password is incorrect. Please try again!', 401)
    );
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  createAndSendToken(user, res, 200);
});
