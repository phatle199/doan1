const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    tourController.uploadTourImageCover,
    tourController.resizeTourImageCover,
    tourController.createTour
  );

router
  .route('/:tourId')
  .get(tourController.getTour)
  .patch(
    tourController.uploadTourImageCover,
    tourController.resizeTourImageCover,
    tourController.updateTour
  )
  .delete(tourController.deleteTour);

module.exports = router;
