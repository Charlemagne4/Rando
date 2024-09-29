const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require('../Utility/catchAsync');
const ExpressErrorHandler = require("../Utility/ExpressErrorHandler");
const { reviewJoiSchema } = require('../schemas');
const Campground = require('../models/campground');
const Review = require('../models/review')

const validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body);  // Validate only the review part
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressErrorHandler(msg, 400);  // Custom error handler
    } else {
        next();  // Proceed if validation passes
    }
};

router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', "Ou Zid T7al FOMEK")
    res.redirect(`/campgrounds/${id}`)

}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    console.log(reviewId, id);

    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    req.flash('success', "Aywh bela3 fomek")
    res.redirect(`/campgrounds/${id}`)

}))

module.exports = router;