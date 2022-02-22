const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tour/:tourId', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);

router.get('/me', authController.protect, viewController.getMe);

router.use(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide')
);

router.get('/manage-tours/add', viewController.getAddNewTourForm);
router.get('/manage-tours/:tourId', viewController.getTourForm);
router.get('/manage-tours', viewController.getManageToursView);

router.get('/manage-users/add', viewController.getAddNewUserForm);
router.get('/manage-users/:userId', viewController.getUserForm);
router.get('/manage-users', viewController.getManageUsersView);

module.exports = router;
