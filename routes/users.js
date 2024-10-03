const express = require("express");
const router = express.Router();
const catchAsync = require('../Utility/catchAsync');
const User = require("../models/user")
const passport = require('passport')
const { ReturnTo } = require('../middleware')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', ReturnTo, catchAsync(async (req, res, next) => {
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


}))

router.get('/login', (req, res) => {
    console.log(req.path, req.originalUrl);
    res.render('users/login')
})

router.post('/login', ReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async (req, res) => {
    console.log("res.locals.returnTo: ", res.locals.returnTo);


    const loggedUser = req.user
    req.flash('success', `Welcome back ${loggedUser.username}`)

    const urlRedirect = res.locals.returnTo || '/campgrounds'
    delete res.locals.returnTo
    res.redirect(urlRedirect)
});

router.delete('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success', 'Athala El jeune')
        res.redirect('/campgrounds')
    })
})



module.exports = router;


