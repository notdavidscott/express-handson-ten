var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3');
var models = require('../models');
const auth = require("../config/auth");
const bcrypt = require("bcryptjs");
const passport = require('passport');
const connectEnsure = require('connect-ensure-login');


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


    router.post('/login', function (req, res, next) {
      const hashedPassword = auth.hashPassword(req.body.password);
      models.users.findOne({
        where: {
          Username: req.body.username
        }
      }).then(user => {
        const isMatch = user.comparePassword(req.body.password)

        if (!user) {
          return res.status(401).json({
            message: 'Login Failed'
          });
        } if (isMatch) {
          const userId = user.UserId;
          const token = auth.signUser(user);
          res.cookie('jwt', token);
          res.redirect('profile/' + userId);
        } else {
          console.log('login')
        }
      });
    });

router.get('/profile/:id', auth.verifyUser, function(req, res, next) {
  if (req.params.id !== String(req.user.UserId)) {
    res.send('this is not your profile');
  } else {
     //checking the status of admin via status variable 
     let status; 
     status = 'Admin';
     if (req.user.Admin) {
     } else {
      status = 'Normal User';
     }
  
  res.render('profile', {
    FirstName: req.user.FirstName,
    LastName: req.user.LastName,
    Email: req.user.Email,
    UserId: req.user.UserId,
    Username: req.user.Username,
    Status: status
  });
}

});


router.get('/logout', function (req, res) {
  res.cookie('jwt', null);
  res.redirect('/users/login');
  });

//admin access

      router.get('/', (req, res, next) => {
        models.users.findAll({
          where: {
            Deleted: null
          }
        })
        .then(usersFound => {
          res.render('users', {
            users: usersFound
          });
        });
      });

  router.get('/:id', (req, res) => {
      let userId = req.params.id;
      models.users.find({
        where: {
          UserId: userId
        }
      }) 
      .then(user => {
        res.render('specificUser', {
          UserId: user.UserId, 
          Username: user.Username,
          FirstName: user.FirstName,
          LastName: user.LastName, 
          Email: user.Email
        });
      });
    });


    router.delete('/:id/delete', (req, res) => {
      let userId = parseInt(req.params.id);
      models.users
      .update(
        {
          Deleted: true
        },
        {
          where: {
            UserId: userId
          }
        }
      )
      .then(user => {
        res.redirect('/users');
      });
    });


module.exports = router;
