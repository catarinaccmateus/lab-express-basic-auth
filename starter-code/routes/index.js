'use strict';

const {
  Router
} = require('express');
const router = Router();

const User = require('./../models/user');
const bcryptjs = require('bcryptjs');

router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Hello World!'
  });
});

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

router.post('/sign-up', (req, res, next) => {
  const {
    username,
    password
  } = req.body;
  bcryptjs
    .hash(password, 10)
    .then(hash => {
      return User.create({
        username: username,
        passwordHash: hash
      });
    })
    .then(user => {
      req.session.user = user._id;
      res.redirect('/');
    })
    .catch(error => {
      next(error);
    });
});

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

router.post('/sign-in', (req, res, next) => {
  const {
    username,
    password
  } = req.body;
  let userId;
  User.findOne({
      username
    })
    .then((user) => {
      if (!user) {
        console.log('The user doesnt exists');
        Promise.reject(new Error('There is no user with that username'))
      } else {
        console.log('The user exists');
        userId = user._id;
        return bcryptjs.compare(password, user.passwordHash)
      }
    })
    .then((result) => {
      if (result) {
        console.log('The comparison of the password was truthy')
        req.session.user = userId;
        res.redirect('/');
      } else {
        console.log('The comparison of the password was falsy')
        return Promise.reject(new Error('Wrong password'))
      }
    })
    .catch(error => {
      next(error);
    });
});

router.post('/sign-out', (req, res, next) => {
  console.log('this is the req session', req.session)
  req.session.destroy();
  console.log('this is the session after sign out', req.session);
  res.redirect('/');
});

module.exports = router;