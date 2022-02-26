const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.patch(
  '/reset-password/:resetPasswordToken',
  authController.resetPassword
);

router.use(authController.protect);

router.patch('/update-my-password', authController.updateMyPassword);
router.patch('/update-my-data', userController.updateMyData);
router.delete('/delete-me', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(
    userController.uploadUserImage,
    userController.resizeUserImage,
    userController.createUser
  );

router
  .route('/:userId')
  .get(userController.getUser)
  .patch(
    userController.uploadUserImage,
    userController.resizeUserImage,
    userController.updateUser
  )
  .delete(userController.deleteUser);

module.exports = router;
