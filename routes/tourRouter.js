const express = require('express');
const tourController = require('./../controllers/tourController');
const reviewRouter = require('./reviewRouter');

const router = express.Router();

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    tourController.uploadImages,
    tourController.resizeUploadImages,
    tourController.getGuidesLocationsStartDates,
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    tourController.uploadImages,
    tourController.resizeUploadImages,
    tourController.getGuidesLocationsStartDates,
    tourController.updateTour
  )
  .delete(tourController.deleteTour);

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
