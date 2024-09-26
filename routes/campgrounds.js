const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const catchAsync = require('../Utility/catchAsync');
const ExpressErrorHandler = require("../Utility/ExpressErrorHandler");
const { campgroundJoiSchema } = require('../schemas');

const validateCampground = (req, res, next) => {
    const { error } = campgroundJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressErrorHandler(msg, 400)
    } else {
        next();
    }
}
//show all camps 
router.get('/', catchAsync(async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
}))
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})
//show the camp found by id 
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id).populate('reviews')
    if (camp) {
        res.render('campgrounds/show', { camp })
    } else {
        res.send("not found")
    }

}))
//Form for editing a camp
router.get('/:id/edit', catchAsync(async (req, res, next) => {

    const { id } = req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/edit', { camp })


}))
//add new camp
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    //if (!req.body.campground) throw new ExpressErrorHandler('Invalid Request', '400');


    const newCamp = new Campground(req.body.campground)
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp.id}`)

}))

//update a camp 
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, req.body.campground)
    res.redirect(`/campgrounds/${id}`)
}));
//delete a camp 
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        await Campground.findByIdAndDelete(id)
        res.redirect(`/campgrounds`)
    } catch (e) {
        next(e);
    }
})

module.exports = router;