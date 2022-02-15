const tourRouter = require('./tourRouter');
const userRouter = require('./userRouter');

const router = (app) => {
  app.use('/api/v1/tours', tourRouter);
  app.use('/api/v1/users', userRouter);
};

module.exports = router;
