const express = require("express");
const mysql = require("mysql2");

const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('images'));







app.set('views engine', 'ejs');
app.get('/login', function (req, res) {
    res.render('login.ejs');
});


app.get('/registration', function (req, res) {
    res.render('registration.ejs');
});
app.listen(8081);
