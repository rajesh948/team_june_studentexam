const express = require("express");
const util = require("util");
const { log } = require('util');  
const app = express();
const bcrypt = require("bcrypt");
const bodyparser = require('body-parser');
const session = require('express-session');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
const oneDay = 1000 * 60 * 60 * 24;
app.use(express.static('public'));
app.use(express.static('images'));
app.use(express.json());
app.set('view engine', 'ejs');
const cookieParser = require("cookie-parser");
app.use(cookieParser());


app.use(session({
  secret: "secretkey",
  saveUninitialized: true,
  resave: false
}));


const exam = require('./router/exam')
app.use('/',exam);

app.listen(1214);
