const express = require("express");
const router = express.Router();
const campground = require('../controllers/campground')
const catchAsync = require('../Utility/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const Multer = require('multer')
const { storage, cloudinary } = require('../cloudinary')
const upload = Multer({ storage })


//show all camps 
router.route('/')
    .get(catchAsync(campground.index))//index
    .post(isLoggedIn, upload.array('campground[images]'), validateCampground, catchAsync(campground.createNewCampground));//add new camp

//Form for creating a new camp
router.get('/new', isLoggedIn, campground.renderNewForm)

router.route('/:id')
    .get(catchAsync(campground.showCamp))//show the camp found by id 
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campground.updateCampground))//update a camp 
    .delete(isLoggedIn, isAuthor, campground.deleteCampground); //delete a camp

//Form for editing a camp
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))
module.exports = router;