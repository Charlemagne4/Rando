const express = require('express')
const app = express()
const path = require('path')
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate')
const port = 3000
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const displayCurrentTime = require('./Utility/time');
const catchAsync = require('./Utility/catchAsync');
const ExpressErrorHandler = require("./Utility/ExpressErrorHandler");
const Joi = require('joi');
const { campgroundJoiSchema, reviewJoiSchema } = require('./schemas');
const Review = require('./models/review')


mongoose.connect('mongodb://127.0.0.1:27017/RanDo').then(() => {
    console.log("CONNECTED!!");
}).catch(err => {
    console.log("CONNECTION FAILED!!");
    console.log(err);
});



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    const { error } = campgroundJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressErrorHandler(msg, 400)
    } else {
        next();
    }
}
const validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body);  // Validate only the review part
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressErrorHandler(msg, 400);  // Custom error handler
    } else {
        next();  // Proceed if validation passes
    }
};

//home(in progress or might delete)
app.get('/', (req, res) => {
    res.render('home')
})
//show all camps 
app.get('/campgrounds', catchAsync(async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
}))
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})
//show the camp found by id 
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id).populate('reviews')
    if (camp) {
        res.render('campgrounds/show', { camp })
    } else {
        res.send("not found")
    }

}))
//Form for editing a camp
app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {

    const { id } = req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/edit', { camp })


}))
//add new camp
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    //if (!req.body.campground) throw new ExpressErrorHandler('Invalid Request', '400');


    const newCamp = new Campground(req.body.campground)
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp.id}`)

}))

//update a camp 
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, req.body.campground)
    res.redirect(`/campgrounds/${id}`)
}));
//delete a camp 
app.delete('/campgrounds/:id', async (req, res) => {
    try {
        const { id } = req.params
        await Campground.findByIdAndDelete(id)
        res.redirect(`/campgrounds`)
    } catch (e) {
        next(e);
    }
})


app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${id}`)

}))

app.delete('/campgrounds/:campId/reviews/:reviewId', catchAsync(async (req, res) => {
    const { campId, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(campId, { $pull: { reviews: reviewId } })
    console.log("tentative de supression");
    res.redirect(`/campgrounds/${campId}`)

}))

app.all('*', (req, res, next) => {
    next(new ExpressErrorHandler("Not Found!", 404))
})
//error handling 
app.use((err, req, res, next) => {
    const { message = "mhmmm...how ??", status = 500 } = err;
    res.status(status)
    res.render('error', { err })
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
//to Time the nodemon shell
displayCurrentTime(); 