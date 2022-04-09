const express = require('express');
const tourController = require('./../controllers/tourController');
const reviewRouter = require('./reviewRouter');

const router = express.Router();

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    tourController.uploadTourImageCover,
    tourController.resizeTourImageCover,
    tourController.getGuidesImageCoverLocations,
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    tourController.uploadTourImageCover,
    tourController.resizeTourImageCover,
    tourController.getGuidesImageCoverLocations,
    tourController.updateTour
  )
  .delete(tourController.deleteTour);

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
