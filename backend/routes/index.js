const tourRouter = require('./tourRouter');

const router = (app) => {
  app.use('/tours', tourRouter);
};

module.exports = router;
