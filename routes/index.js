var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3');
const models = require('../models');




//  router.get('/users/:id', (req, res) => {
//       let userId = req.params.id;
//       models.users.find({
//         where: {
//           UserId: userId
//         }
//       }) 
//       .then(user => {
//         res.render('specificUser', {
//           UserId: user.UserId, 
//           Username: user.Username,
//           FirstName: user.FirstName,
//           LastName: user.LastName, 
//           Email: user.Email
//         });
//       });
//     });


module.exports = router;
