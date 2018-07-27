var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3');
const models = require('../models');

router.get('/users', (req, res, next) => {
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



module.exports = router;
