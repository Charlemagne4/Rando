const User = require("../models/user")

module.exports.registerForm = (req, res) => {
    res.render('users/register')
}
module.exports.registerUser= async (req, res, next) => {
    try {
        const { password, username, email } = req.body;
        const newUser = new User(
            {
                email,
                username
            }
        );
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, function (err) {
            if (err) { return next(err); }
            req.flash('success', 'Welcome to Yelp Camp')
            const urlRedirect = res.locals.returnTo || '/campgrounds'
            delete res.locals.returnTo
            res.redirect(urlRedirect)
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/register')
    }


}

module.exports.loginForm= (req, res) => {
    console.log(req.path, req.originalUrl);
    res.render('users/login')
}

module.exports.loginUser = async (req, res) => {
    console.log("res.locals.returnTo: ", res.locals.returnTo);


    const loggedUser = req.user
    req.flash('success', `Welcome back ${loggedUser.username}`)

    const urlRedirect = res.locals.returnTo || '/campgrounds'
    delete res.locals.returnTo
    res.redirect(urlRedirect)
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success', 'Athala El jeune')
        res.redirect('/campgrounds')
    })
}