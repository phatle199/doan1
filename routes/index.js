const tourRouter = require('./tourRouter');
const userRouter = require('./userRouter');
const reviewRouter = require('./reviewRouter');
const viewRouter = require('./viewRouter');

const router = (app) => {
  app.use('/api/v1/tours', tourRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/reviews', reviewRouter);
  app.use('/', viewRouter);
};

module.exports = router;
