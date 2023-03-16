const { render } = require('ejs');
const express = require('express');
const mysql = require('mysql2');
const app = express();
const util = require('util');
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//Database Connection

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'job_application_db'
});

con.connect((err) => {
    if (err) { console.log(err); }
    console.log("success connection");

});


const sendquery = util.promisify(con.query.bind(con));


app.get("/questionpage",(req,res)=>{
    res.render("examQuestion");
})

app.listen(3434);