const Campground = require('./models/campground')
const ExpressErrorHandler = require("./Utility/ExpressErrorHandler");
const { campgroundJoiSchema, reviewJoiSchema } = require('./schemas');


module.exports.isLoggedIn = (req, res, next) => {
    console.log('User: ', req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Lzm tkoun loggedIn')
        return res.redirect('/login')
    }
    next()
}
module.exports.ReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        console.log("req.session.returnTo: ", req.session.returnTo);

        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', "Action Not Authorized")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressErrorHandler(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body);  // Validate only the review part
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressErrorHandler(msg, 400);  // Custom error handler
    } else {
        next();  // Proceed if validation passes
    }
};