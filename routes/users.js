var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3');
var models = require('../models');
const auth = require("../config/auth");
const bcrypt = require("bcryptjs");
const passport = require('passport');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/signup", function (req, res, next) {
  res.render('signup')
});

router.post('/signup', function(req, res, next) {
  const hashedPassword = auth.hashPassword(req.body.password);
  models.users
    .findOne({
      where: {
        Username: req.body.Username
      }
    }) 
    .then(user => {
      if (user) {
      res.send('this user already exists');
    } else {
      models.users
      .create({
        FirstName: req.body.firstName, 
        LastName: req.body.lastName,
        Email: req.body.email,
        Username: req.body.username,
        Password: hashedPassword
      })
      .then(createdUser => {
        const isMatch = createdUser.comparePassword(req.body.password);

        if (isMatch) {
          const userId = createdUser.UserId;
          console.log(userId);
          const token = auth.signUser(createdUser);
          res.cookie('jwt', token);
          res.redirect('profile/' + userId);
        } else {
          console.log('not a match');
        }
      });
    }
  });
});

router.get('/login', function (req, res, next) {
  res.render('login');
});



module.exports = router;
