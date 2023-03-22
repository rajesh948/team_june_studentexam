const express = require('express');
const route = express.Router();
const userAuth = require('../controller/userAuth');

// User Authentication 


route.get('/forgotpassword',userAuth.forgotpassword);

route.post('/updatepassword',userAuth.updatepassword);

module.exports = route;