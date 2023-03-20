const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const util = require("util");
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('images'));
app.use(express.json());
app.set('view engine', 'ejs');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
app.use(cookieParser());
var insertId;
var insertId1;

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Exam"
});

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

app.use(sessions({
  secret: "secretkey",
  saveUninitialized: false,
  cookie: { maxAge: oneDay },
  resave: false
}));


const query = util.promisify(conn.query).bind(conn);

conn.connect((err) => {
  if (err) throw err;
  console.log("Connected");
});







//sumit ::::: home page backend task


app.get(['/', '/home'], async (req, res) => {
  var data = [];
  if (req.session.user_id) {
    let user_id = req.session.user_id;
    let user_email = req.session.email;
    var sql = `select fname from student_master where email="${user_email}"`;
    var username = await query(sql);

    username = username[0].fname;
    req.session.username = username;

    // console.log("username",username);

    var sql1 = `select exam_name,exam_id from exam_master where exam_isActive=0`;
    var examdata = await query(sql1);

    var sql2 = `select exam_name from exam_master,result_master where exam_master.exam_id=result_master.exam_id and exam_isActive=0 and user_id=${user_id}`;
    var attemptdata = await query(sql2);

    // console.log("examdata",examdata)
    // console.log("attempted Exam Data",attemptdata)

    let flag = 0;

    for (let i = 0; i < examdata.length; i++) {
      flag = 0;
      for (let j = 0; j < attemptdata.length; j++) {
        if (examdata[i].exam_name == attemptdata[j].exam_name) {
          data.push({ 'exam_id': examdata[i].exam_id, 'exam_name': examdata[i].exam_name, 'attempted': true })
          flag = 1;
        }
      }
      if (flag == 0) {
        data.push({ 'exam_id': examdata[i].exam_id, 'exam_name': examdata[i].exam_name, 'attempted': false })
      }
    }

    // console.log("sumit data :::",data)

    res.render('home', { data, username, sesdata: req.session });
  } else {
    res.redirect("/login");

  }
})



// Edit - profile page :- 

app.get('/edit', async (req, res) => {
  var user_email = req.session.email;

  var sql = `select fname,lname,gender,email,mobile,enrollment,qualification,city,college,birthdate from student_master where email="${user_email}"`;
  var studdata = await query(sql);


  console.log(studdata);


  res.render('edit-profile', { data: studdata[0] });
});


// Editing user data in database :-

app.get('/updatedata', async (req, res) => {
  console.log('---------------------------------------------------------------------')
  var alldata = JSON.parse(req.query.newdata)
  console.log(alldata)
  console.log('----------------------------------------------------------------------')

  var session =  req.session;

  var user_id = session.user_id;
  var stud_id = session.stud_id;

  try {
    console.log('try called')
    var sql = `update student_master set fname='${alldata.fname}', lname='${alldata.lname}', gender='${alldata.gender}', email='${alldata.email}', mobile='${alldata.phone}', enrollment='${alldata.enroll}', qualification='${alldata.qualification}', city='${alldata.city}', college='${alldata.college}', birthdate='${alldata.dob}' where id=${stud_id}`;
    var result1 = await query(sql)

    var sql1 = `update user_master set username='${alldata.email}' where user_id=${user_id}`;
    var result2 = await query(sql1)

    session.email = alldata.email;

    res.json("hello")
  }
  catch {
    console.log('catch called')
    res.json("Update didn't happen")
  }
})





app.listen(8081);
