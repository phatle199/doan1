const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewController.alerts);

router.get(
  '/',
  // bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);
router.get('/tours/:tourId', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);
router.get('/me', authController.protect, viewController.getMe);
router.get('/me/my-tours', authController.protect, viewController.getMyTours);
router.get(
  '/me/my-reviews',
  authController.protect,
  viewController.getMyReviews
);

router.use(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide')
);

router.get('/me/manage-tours/add', viewController.getCreateTourForm);
router.get('/me/manage-tours/:tourId', viewController.getUpdateTourForm);
router.get('/me/manage-tours', viewController.getToursList);

router.get('/me/manage-users/add', viewController.getCreateUserForm);
router.get('/me/manage-users/:userId', viewController.getUpdateUserForm);
router.get('/me/manage-users', viewController.getUsersList);

module.exports = router;
