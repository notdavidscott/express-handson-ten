const jwt = require('jsonwebtoken'); 
const models = require('../models/index'); 
const bcrypt = require("bcryptjs");

module.exports = {
    signUser: function(user) {
      const token = jwt.sign(
        {
          Username: user.Username,
          UserId: user.UserId,
          Admin: user.Admin
        },
        'secret',
        {
          expiresIn: '1h'
        }
      );
      return token;
    },
  
    verifyUser: function(req, res, next) {
      try {
        let token = req.cookies.jwt;
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        models.users
          .findOne({
            where: {
              UserId: decoded.UserId,
              Admin: decoded.Admin
            }
          })
          .then(user => {
            console.log('User Id: ' + user.UserId + '. Admin Access: ' + user.Admin);
            req.user = user;
            next();
          });
      } catch (err) {
        console.log(err);
        return res.status(401).json({
          message: 'Auth Failed'
        });
      }
    },
    // verifyAdmin: function(req, res, next) {
    //   try {
    //     let token = req.cookies.jwt;
    //     const decoded = jwt.verify(token, 'secret');
    //     req.userData = decoded;
    //     models.users
    //       .findOne({
    //         where: {
    //           UserId: decoded.UserId,
    //           Admin: true  
    //         }
    //       })
    //       .then(user => {
    //         req.user = user;
    //         next();
    //       });
    //   } catch (err) {
    //     console.log(err);
    //     return res.status(401).json({
    //       message: 'Auth Failed'
    //     });
    //   }
    // },
  
    hashPassword: function(plainTextPassword) {
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(plainTextPassword, salt);
      return hash;
    }
  };