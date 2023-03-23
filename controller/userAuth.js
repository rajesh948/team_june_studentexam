const con = require("../db");
const bodyparser = require("body-parser");
const express = require("express");
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
      res.render('registration.ejs',{error:"",register_data:""});
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
};

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
    var sql = ` insert into student_master (fname,lname,gender,email,mobile,enrollment,qualification,city,college,birthdate,pass) VALUES('${req.body.fname}','${req.body.lname}','${req.body.gender}','${req.body.email}','${req.body.number}','${req.body.enrollment}','${req.body.qualification}','${req.body.city}','${req.body.college}','${req.body.dob}','${pass}');`;
    const [data] = await con.query(sql);
    insertId1 = data.insertId;

    var user_sql = `insert into user_master (username,password,role,isActive) values ('${req.body.email}','${pass}','student','0');`;

    const [data1] = await con.query(user_sql);
    insertId2 = data1.insertId;

      res.render("activation-page", { user_id: insertId1, act_message: "Thank you for Registering!" });
    } else {
      var register_data = req.body;
      // console.log(register_data);
      res.render("registration",{error:"Email-id already exists!!",register_data});
    }
  }

//Account activationPage --------------------------------

const activation = async (req, res) => {
  var user_id = req.query.user_id;

  if (user_id) {
    var sql = `update user_master set isActive = 1 where user_id =${user_id};`;
    var [data] = await con.query(sql);
  }
  res.redirect("/login");
};

//Render Login Page --------------------------------

const login = async (req,res) =>{
  
    if (req.session.user_id) {
        res.redirect("/home");

    } else {
        res.render("login.ejs", { error: "" ,forgotpassword:"",login_data:""});
    }
}

//Verify Login Details------------------------------------------------

const login_api = async (req, res) => {
  let login_data = req.body;
  console.log(login_data);
  var studidsql = `select student_id from student_master where email = "${login_data.email}"`;
  var [studdata] = await con.query(studidsql);

  console.log(studdata);

  var [data] = await con.query(
    `select user_id,password,isActive from user_master where username = "${login_data.email}"`
  );
  if (!data[0]) {
    return res.render("login.ejs", { error: "**Invalid Email Or Password !",forgotpassword:"",login_data });
  }
  if (data[0].isActive == 0) {
    return res.render("activation-page", {
      user_id: data[0].user_id,
      act_message: "Your Account Is Not Active!",
    });
  }

  var check_pass = await bcrypt.compare(login_data.Password, data[0].password);

  if (check_pass) {
    req.session.user_id = data[0].user_id;
    req.session.stud_id = studdata[0].id;
    req.session.email = login_data.email;
    res.redirect("/home");
  } else {
    res.render("login.ejs", { error: "**Invalid Email Or Password !" , forgotpassword:"",login_data});
  }
};

//Render Home Page------------------------------------------------

const home = async (req, res) => {
  var data = [];
  if (req.session.user_id) {
    console.log(req.session);

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
          data.push({
            exam_id: examdata[i].exam_id,
            exam_name: examdata[i].exam_name,
            attempted: true,
          });
          flag = 1;
        }
      }
      if (flag == 0) {
        data.push({
          exam_id: examdata[i].exam_id,
          exam_name: examdata[i].exam_name,
          attempted: false,
        });
      }
    }

    res.render("home", { data, username });
  } else {
    res.redirect("/login");
  }
};

//Logout Api -----------------------------------------------------------

const logout = async (req, res) => {
  req.session.destroy();
  return res.clearCookie("connect.sid").redirect("/login");
  // return res.redirect("/login");
};

// Forgot Password ------------------------------------------------

const forgotpassword = (req, res) => {
  if(req.session.user_id)
  {
    res.redirect('/home');
  }
  else{
    res.render("forgotpassword");
  }
};

const updatepassword = async (req, res) => {
  var password = req.body.password;
  console.log(password);
  const pass = await bcrypt.hash(password, 10);
  console.log(pass);
  var confirmpass = await bcrypt.compare(req.body.confirmPassword, pass);
  console.log(confirmpass);

  if (confirmpass == true) {
    var sql = `update user_master,student_master set user_master.password = '${pass}',student_master.pass='${pass}' where student_master.email = '${req.body.email}' and user_master.username='${req.body.email}'`;
    var data = await con.query(sql);
    console.log(sql);
    res.render('login',{forgotpassword:"**Password reset successfully!!",error:"",login_data:""})

  }
};

// Edit profile------------------------------------------------------------------
const edit = async (req, res) => {
  var user_email = req.session.email;

  var sql = `select fname,lname,gender,email,mobile,enrollment,qualification,city,college,birthdate from student_master where email="${user_email}"`;
  var [studdata] = await con.query(sql);

  res.render("edit-profile", { data: studdata[0] });
};

const updatedata = async (req, res) => {
  if(req.session.user_id)
  {
    var alldata = JSON.parse(req.query.newdata);

  var session = req.session;

  var user_id = session.user_id;
  var stud_id = session.stud_id;

  try {
    var sql = `update student_master set fname='${alldata.fname}', lname='${alldata.lname}', gender='${alldata.gender}', email='${alldata.email}', mobile='${alldata.phone}', enrollment='${alldata.enroll}', qualification='${alldata.qualification}', city='${alldata.city}', college='${alldata.college}', birthdate='${alldata.dob}' where id=${stud_id}`;
    var [result1] = await con.query(sql);

    var sql1 = `update user_master set username='${alldata.email}' where user_id=${user_id}`;
    var [result2] = await con.query(sql1);

    session.email = alldata.email;

    res.json("Update done..!");
  } catch {
    res.json("Update didn't happen");
  }
  }
  else{
    res.redirect('/home')
  }
  
};

module.exports = {
  registration,
  verify,
  register_api,
  activation,
  login,
  login_api,
  home,
  logout,
  updatepassword,
  forgotpassword,
  edit,
  updatedata,
};
