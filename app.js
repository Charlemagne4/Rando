const express = require('express')
const app = express()
const path = require('path')
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate')
const port = 3000
const methodOverride = require('method-override')
const displayCurrentTime = require('./Utility/time');
const ExpressErrorHandler = require("./Utility/ExpressErrorHandler");


const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')


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


//ROUTES
app.use("/campgrounds", campgroundsRoutes)
app.use("/campgrounds/:id/reviews", reviewsRoutes)

//home(in progress or might delete)
app.get('/', (req, res) => {
    res.render('home')
})


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