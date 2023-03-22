
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



const forgotpassword = (req,res)=>{
  res.render('forgotpassword');
}


const updatepassword = async (req,res)=>{
  var password = req.body.password;
  console.log(password);
  const pass = await bcrypt.hash(password, 10);
  console.log(pass);
  var confirmpass = await bcrypt.compare(req.body.confirmPassword, pass);
  console.log(confirmpass);

  if(confirmpass==true){
    var sql = `update user_master,student_master set user_master.password = '${pass}',student_master.pass='${pass}' where student_master.email = '${req.body.email}' and user_master.username='${req.body.email}'`
    var data = await query(sql);
    console.log(sql);
    res.render('login',{forgotpassword:"**Password reset successfully!!",error:""})

  }
}

module.exports = {registration,verify,register_api,activation,login,login_api,home,logout,updatepassword,forgotpassword}