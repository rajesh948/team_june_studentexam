
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

//Registration Page ----------------------------------------------- 

const registration =  function (req, res) {
    if (req.session.user_id) {
      res.redirect("/home");  
    } else {
      res.render('registration.ejs');
    }
  }

// Verify Registration Details--------------------------------

 const verify = async (req, res) => {
  const email_arr = [];
  var sql = `select email from student_master;`;
  var [data] = await con.query(sql);

  for (i = 0; i < data.length; i++) {
    email_arr.push(data[i].email);
  }

  res.json(email_arr);
}

//Insert Registration Details --------------------------------

  const register_api = async (req, res) => {

    var password = req.body.password;
    const pass = await bcrypt.hash(password, 10);
    var confirmpass = await bcrypt.compare(req.body.confirmPassword, pass);
  
    const email_arr = [];
    var sql = `select email from student_master;`;
    var [data] = await con.query(sql);
  
    for (i = 0; i < data.length; i++) {
      email_arr.push(data[i].email);
    }
    var insertId2;
    var insertId1;
    if (confirmpass == true && !email_arr.includes(req.body.email)) {
      var sql = ` insert into student_master (fname,lname,gender,email,mobile,enrollment,qualification,city,college,birthdate,pass) VALUES('${req.body.fname}','${req.body.lname}','${req.body.gender}','${req.body.email}','${req.body.number}','${req.body.enrollment}','${req.body.qualification}','${req.body.city}','${req.body.college}','${req.body.dob}','${pass}');`
      const [data] = await con.query(sql);
      insertId1 = data.insertId;        
  
      var user_sql = `insert into user_master (username,password,role,isActive) values ('${req.body.email}','${pass}','student','0');`
  
      const [data1] = await con.query(user_sql);
      insertId2 = data1.insertId;

      res.render("activation-page", { user_id: insertId1, act_message: "Thank you for Registering!" });
    } else {
      res.redirect("/registration");
    }
  }

//Account activationPage --------------------------------

const activation = async (req, res) => {
  var user_id = req.query.user_id;
  
  if (user_id) {
    var sql = `update user_master set isActive = 1 where user_id =${user_id};`
    var [data] = await con.query(sql);
  }
  res.redirect('/login');
}

//Render Login Page --------------------------------

const login = async (req,res) =>{
  
    if (req.session.user_id) {
        res.render("home");

    } else {
        res.render("login.ejs", { error: "" ,forgotpassword:""});
    }
}

//Verify Login Details------------------------------------------------

const login_api = async (req,res) =>{
  let login_data = req.body;  

  var [data] = await con.query(`select user_id,password,isActive from user_master where username = "${login_data.email}"`);
  if (!data[0]) {
    return res.render("login.ejs", { error: "**Invalid Email Or Password !" });
  }
  if (data[0].isActive == 0) {
    return res.render("activation-page", { user_id: data[0].user_id, act_message: "Your Account Is Not Active!" });
  }

  var check_pass = await bcrypt.compare(login_data.Password, data[0].password);

  if (check_pass) {
    req.session.user_id = data[0].user_id;
    req.session.email = login_data.email;
    res.redirect('/home');

  } else {
    res.render("login.ejs", { error: "**Invalid Email Or Password !" });
  }
}






module.exports = {registration,verify,register_api,activation,login,login_api,home,logout,updatepassword,forgotpassword}