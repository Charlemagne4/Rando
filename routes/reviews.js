const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require('../Utility/catchAsync');
const review = require('../controllers/review')
const { validateReview, isReviewAuthor, isLoggedIn } = require('../middleware')



router.post('/', isLoggedIn, validateReview, catchAsync(review.addReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review.delete))

module.exports = router;