const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require('../Utility/catchAsync');
const ExpressErrorHandler = require("../Utility/ExpressErrorHandler");
const { reviewJoiSchema } = require('../schemas');
const Campground = require('../models/campground');
const Review = require('../models/review')
const { validateReview, isReviewAuthor, isLoggedIn } = require('../middleware')



router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user.id
    console.log(`${review.author} added a review`);
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', "Ou Zid T7al FOMEK")
    res.redirect(`/campgrounds/${id}`)

}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    req.flash('success', "Aywh bela3 fomek")
    res.redirect(`/campgrounds/${id}`)

}))

module.exports = router;