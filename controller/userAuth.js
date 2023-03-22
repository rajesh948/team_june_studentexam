
const con = require('../db');
const bodyparser = require('body-parser');
const express = require('express');
const app = express();
const bcrypt = require("bcrypt");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());



//Render Home Page------------------------------------------------

const home = async (req, res) => {
  var data = [];
  if (req.session.user_id) {
    let user_id = req.session.user_id;
    let user_email = req.session.email;
    var sql = `select fname from student_master where email="${user_email}"`;
    var [username] = await con.query(sql);
    username = username[0].fname;
    req.session.username = username;

    var sql1 = `select exam_name,exam_id from exam_master where exam_isActive=0`;
    var [examdata] = await con.query(sql1);

    var sql2 = `select exam_name from exam_master,result_master where exam_master.exam_id=result_master.exam_id and submited = 1 and exam_isActive=0 and user_id=${user_id}`;
    var [attemptdata] = await con.query(sql2);

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

    res.render('home', { data, username });
  } else {
    res.redirect("/login");

  }
}

//Logout Api -----------------------------------------------------------

const logout = async (req, res) => {
  req.session.destroy();
  res.redirect("/login");
}


module.exports = {home,logout};