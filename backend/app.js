const express = require('express');
const morgan = require('morgan');

const router = require('./routes');

const app = express();

// Body parser
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

router(app);

module.exports = app;
