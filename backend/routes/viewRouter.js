const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/tour/:tourId', viewController.getTour);
router.get('/login', viewController.getLoginForm);

router.get('/me', authController.protect, viewController.getMe);

module.exports = router;
