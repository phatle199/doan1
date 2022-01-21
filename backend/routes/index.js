const tourRouter = require('./tourRouter');
const userRouter = require('./userRouter');

const router = (app) => {
  app.use('/tours', tourRouter);
  app.use('/users', userRouter);
};

module.exports = router;
