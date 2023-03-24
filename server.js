const express = require("express");
const util = require("util");
const { log } = require("util");
const app = express();
const bcrypt = require("bcrypt");
const bodyparser = require("body-parser");
const session = require("express-session");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("images"));
app.use(express.json());
app.set("view engine", "ejs");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
require("dotenv").config();


// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(session({
  secret: "secretkey",
  saveUninitialized: false,
  cookie: { maxAge: oneDay },
  resave: false
}));

const exam = require('./router/exam')
app.use('/',exam);


const auth = require('./router/user')
app.use('/',auth);


app.listen(8081);
