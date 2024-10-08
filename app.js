if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const displayCurrentTime = require('./Utility/time');
const ExpressErrorHandler = require("./Utility/ExpressErrorHandler");
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')

const port = 3000
const app = express()
const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users')


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
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'vintage',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: false, // Make sure secure is false for HTTP in development
        httpOnly: true, // Optional, prevents JavaScript access to cookies
    }
};

app.use(session(sessionConfig))
app.use(flash())
//authentification init with passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get('/faker', async (req, res) => {
    const user = new User(
        {
            email: 'moha@gmail.com',
            username: 'moh EL FAKER'

        }
    )
    const newUser = await User.register(user, '1234')
    res.send(newUser);

})

app.use('/', function (req, res, next) {
    res.locals.currentUser = req.user; 
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})
//ROUTES
app.use("/", usersRoutes)
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