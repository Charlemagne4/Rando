module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Lzm tkoun loggedIn')
        return res.redirect('/login')
    }
    next()
}
