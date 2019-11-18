'use strict';

const {
    Router
} = require('express');
const router = Router();
const routeGuard = require('./../middleware/route-guard')

const User = require('./../models/user');


router.get('/profile', routeGuard, (req, res, next) => {
    res.render('profile');
});

router.get('/main', routeGuard, (req, res, next) => {
    res.render('main');
});

router.get('/private', routeGuard, (req, res, next) => {
    res.render('private');
});

router.get('/profile/edit', routeGuard, (req, res, next) => {
    res.render('edit');
});

router.post('/profile/edit', routeGuard, (req, res, next) => {
    const userID = req.session.user;
    //console.log(req.body);
    //console.log(req.body.name);
    //THE ERROR IS HERE
    console.log( 'this is the session', req.session);
    console.log('this is the id', userID);
    console.log('this is the input', req.body.name);
    User.findByIdAndUpdate({_id: userID}, {
            name: req.body.name
        })
        .then((user) => {
            console.log('the name was changed', user);
            res.render('main');
        })
        .catch((err) => {
            console.log('not possible to update name');
            next(err);
        });
});



module.exports = router;