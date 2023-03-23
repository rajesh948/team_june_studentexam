const express = require('express');
const route = express.Router();
const userAuth = require('../controller/userAuth');

// User Authentication 

route.get('/registration',userAuth.registration);

route.get('/verify',userAuth.verify);

route.post('/register-api',userAuth.register_api);

route.get('/activation-api',userAuth.activation);

route.get('/login',userAuth.login);

route.get('/',userAuth.login);

route.post('/login-api',userAuth.login_api);

route.get('/home',userAuth.home);

route.get('/logout',userAuth.logout);

route.get('/forgotpassword',userAuth.forgotpassword);

route.post('/updatepassword',userAuth.updatepassword);

module.exports = route;