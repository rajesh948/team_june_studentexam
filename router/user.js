const express = require('express');
const route = express.Router();
const userAuth = require('../controller/userAuth');

// User Authentication 


route.get('/home',userAuth.home);

route.get('/logout',userAuth.logout);



module.exports = route;