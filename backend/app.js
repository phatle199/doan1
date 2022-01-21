const express = require('express');
const morgan = require('morgan');

const router = require('./routes');
const AppError = require('./utils/AppError');
const errorController = require('./controllers/errorController');

const app = express();

// Body parser
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

router(app);

app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl}`, 404));
});

app.use(errorController.globalErrorHandler);

module.exports = app;
