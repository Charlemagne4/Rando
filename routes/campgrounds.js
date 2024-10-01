const express = require("express");
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../Utility/catchAsync');
const ExpressErrorHandler = require("../Utility/ExpressErrorHandler");
const { campgroundJoiSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware')

const validateCampground = (req, res, next) => {
    const { error } = campgroundJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressErrorHandler(msg, 400)
    } else {
        next();
    }
}
router.get('/', catchAsync(async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
}))
//show all camps 
router.get('/new', isLoggedIn, (req, res) => {

    res.render('campgrounds/new')
})
//show the camp found by id 
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id).populate('reviews')
    if (!camp) {
        req.flash('error', "rak Tkhalet fe swaleh khatik (Campground not found)")
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp })
}))
//Form for editing a camp
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    if (!camp) {
        req.flash('error', "rak Tkhalet fe swaleh khatik (Campground not found)")
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp })
}))
//add new camp
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    //if (!req.body.campground) throw new ExpressErrorHandler('Invalid Request', '400');


    const newCamp = new Campground(req.body.campground)
    await newCamp.save();
    req.flash('success', "Waw ak ta3ref tzid campground")
    res.redirect(`/campgrounds/${newCamp.id}`)

}))

//update a camp 
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, req.body.campground)
    req.flash('success', "ZID rak ta3ref Tupdati Campground")
    res.redirect(`/campgrounds/${id}`)
}));
//delete a camp 
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params
        const deletedCamp = await Campground.findByIdAndDelete(id)
        req.flash('success', `LALAAAAA na7it "${deletedCamp.title}"`)
        res.redirect(`/campgrounds`)
    } catch (e) {
        next(e);
        req.flash('error', `manich 3aref wsh aw sari m3a ${id}`)
    }
})

module.exports = router;