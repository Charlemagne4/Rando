module.exports.isLoggedIn = (req, res, next) => {
    console.log('User: ', req.user);
    req.session.returnTo = req.originalUrl;
    if (!req.isAuthenticated()) {
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
