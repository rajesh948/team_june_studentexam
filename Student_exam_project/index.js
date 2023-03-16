var express = require('express');
var mysql = require('mysql2');
var app = express();
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(express.json());
var bodyparser = require("body-parser");
app.use(express.urlencoded({ extended: true }));

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Exam",
});

conn.connect((err) => {
    if (err) throw err;
    console.log("Connected");
});
  

app.get('/',(req,res)=>{
    res.render("page5");
})

app.get('/thankyou',(req,res)=>{
    res.render("thankyou");
})

app.listen(4000);