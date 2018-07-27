const passport = require('passport'); 
const LocalStrategy = require('passport-local').Strategy; 
const models = require('../models'); 
const bcrypt = require("bcryptjs");
