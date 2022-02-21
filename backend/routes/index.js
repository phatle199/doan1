const tourRouter = require('./tourRouter');
const userRouter = require('./userRouter');
const viewRouter = require('./viewRouter');

const router = (app) => {
  app.use('/api/v1/tours', tourRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/', viewRouter);
};

module.exports = router;
