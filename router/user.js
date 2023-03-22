const express = require('express');
const route = express.Router();
const userAuth = require('../controller/userAuth');

// User Authentication 

route.get('/registration',userAuth.registration); // nandani
 
route.get('/verify',userAuth.verify);  // nandani

route.post('/register-api',userAuth.register_api);  //nandani
 
route.get('/activation-api',userAuth.activation);  //nandani

route.get('/login',userAuth.login);  //nandani

route.post('/login-api',userAuth.login_api); //nandani


module.exports = route;