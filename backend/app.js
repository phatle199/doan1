const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

const router = require('./routes');
const AppError = require('./utils/AppError');
const errorController = require('./controllers/errorController');

const app = express();

// MIDDLEWARE
// Secure HTTP Headers
app.use(helmet());
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//   })
// );

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'Too many request from this IP. Please try again in an hour!',
});

app.use('/api/v1', limiter);

// Body parser
app.use(
  express.json({
    limit: '10kb',
  })
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against cross-site script
app.use(xssClean());

// Preventing parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

router(app);

app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl}`, 404));
});

app.use(errorController.globalErrorHandler);

module.exports = app;
