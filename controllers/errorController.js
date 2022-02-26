const AppError = require('../utils/AppError');

const handleCastError = (err) => {
  return new AppError(`${err.message}`, 400);
};

const handleDuplicateError = (err) => {
  const duplicateField = Object.keys(err.keyValue)[0];
  const duplicateValue = err.keyValue[duplicateField];
  return new AppError(
    `Duplicate error. Duplicate field '${duplicateField}' with value '${duplicateValue}'`,
    400
  );
};

const handleValidatorError = (err) => {
  return new AppError(`${err.errors[Object.keys(err.errors)[0]]}`, 400);
};

const handleJsonWebTokenError = (err) => {
  return new AppError('Invalid json web token. Please try again!', 401);
};

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  res.status(err.statusCode).json({
    status: 500,
    message:
      'Có cái gì sai sai ở phía server rồi pạn êy. Thử lại sau nhé hihi 😁😁😁',
  });
};

exports.globalErrorHandler = (err, req, res, next) => {
  console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err); // clone ra 1 object error, dùng let vì cần gán lại
    // console.log(error.name);
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateError(error);
    if (error._message && error._message.includes('validation failed'))
      error = handleValidatorError(error);
    if (error.name === 'JsonWebTokenError')
      error = handleJsonWebTokenError(error);
    return sendErrorProd(error, req, res);
  }

  sendErrorDev(err, req, res);
};
