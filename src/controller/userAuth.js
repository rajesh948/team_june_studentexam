const con = require('../config/db');
const bodyparser = require("body-parser");
const nodemailer = require("nodemailer");
const express = require("express");
const emailExistence = require('email-existence');
const app = express();
const bcrypt = require("bcrypt");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
require("dotenv").config("../.env");
const cookieParser = require("cookie-parser");
const { log } = require('console');
app.use(cookieParser());
app.use(express.json());

//Registration Page -----------------------------------------------

const registration = function (req, res) {
  if (req.session.email) {
    res.redirect("/home");
  } else {
    res.render('registration.ejs', { error: "", register_data: "" });
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
  var register_data = req.body;
  var password = req.body.password;
  let userEmail = req.body.email;
  const pass = await bcrypt.hash(password, 10);
  var confirmpass = await bcrypt.compare(req.body.confirmPassword, pass);
  let active_error = " ";
  const email_arr = [];
  var sql = `select email from student_master;`;
  var [data] = await con.query(sql);

  for (i = 0; i < data.length; i++) {
    email_arr.push(data[i].email);
  }
  var insertId2;
  emailExistence.check(req.body.email, async function (err, data) {
    console.log('res: ' + data);
    if (data) {

      if (confirmpass == true && !email_arr.includes(req.body.email)) {
        var sql = ` insert into student_master (fname,lname,gender,email,mobile,enrollment,qualification,city,college,birthdate,pass) VALUES('${req.body.fname}','${req.body.lname}','${req.body.gender}','${req.body.email}','${req.body.number}','${req.body.enrollment}','${req.body.qualification}','${req.body.city}','${req.body.college}','${req.body.dob}','${pass}');`;
        const [data] = await con.query(sql);


        var user_sql = `insert into user_master (username,password,role,isActive) values ('${req.body.email}','${pass}','student','0');`;

        const [data1] = await con.query(user_sql);
        insertId2 = data1.insertId;

        req.session.user_id = insertId2;



        let rendom_num = Math.floor(1000000 + Math.random() * 999999);

        req.session.otp = rendom_num;

        console.log(process.env.email);
        let config = {
          service: 'gmail',
          auth: {
            user: process.env.email,
            pass: process.env.pass,
          },
        }

        let transporter = nodemailer.createTransport(config);

        let message = {
          from: process.env.email,
          to: userEmail,
          subject: 'Activation Code',
          html: `<h1>hello ${req.body.fname} ${req.body.lname} your Accout Activation Code !! </h1>
               <p>Activation Code : <strong>${rendom_num}</strong></P>
        `
        }

        transporter.sendMail(message).then(() => {

          return res.render("activation-page", { act_message: "Activation Page!", active_error });
        }).catch(error => {
          if (error) throw error;
          return res.status(500).json({ error });
        })



      } else {

        res.render("registration", { error: "Email-id already used!!", register_data });
      }
    } else {
      res.render("registration", { error: "Email-id is not exists!!", register_data });
    }
  })
}

//Account activationPage --------------------------------

const activation = async (req, res) => {
  let activation_code = req.query.active_code || 1;
  let otp = req.session.otp || 0;
  let user_id = req.session.user_id;
  if (activation_code == otp) {
    var sql = `update user_master set isActive = 1 where user_id =${user_id};`;
    var [data] = await con.query(sql);
    req.session.user_id = 0;
    res.redirect("/login");
  } else {
    return res.render("activation-page", { act_message: "Activation Page !", active_error: "Activation Code is invalid !!!" });
  }

};

//Render Login Page --------------------------------

const login = async (req, res) => {

  if (req.session.email) {
    res.redirect("/home");

  } else {
    res.render("login.ejs", { error: "", forgotpassword: "", login_data: "" });
  }
}

//Verify Login Details------------------------------------------------

const login_api = async (req, res) => {
  let active_error = "";
  let login_data = req.body;
  let userEmail = req.body.email;
  var studidsql = `select student_id,fname,lname from student_master where email = "${login_data.email}"`;
  var [studdata] = await con.query(studidsql);


  var [data] = await con.query(
    `select user_id,password,isActive from user_master where username = "${login_data.email}"`
  );
  if (!data[0]) {
    return res.render("login.ejs", { error: "**Invalid Email  !", forgotpassword: "", login_data });
  }




  if (data[0].isActive == 0) {
    req.session.user_id = data[0].user_id;
    let rendom_num = Math.floor(1000000 + Math.random() * 999999);

    req.session.otp = rendom_num;

    console.log(process.env.email);
    let config = {
      service: 'gmail',
      auth: {
        user: process.env.email,
        pass: process.env.pass,
      },
    }

    let transporter = nodemailer.createTransport(config);

    let message = {
      from: process.env.email,
      to: userEmail,
      subject: 'Activation Code',
      html: `<h1>hello ${studdata[0].fname} ${studdata[0].lname} your Accout Activation Code !! </h1>
           <p>Activation Code : <strong>${rendom_num}</strong></P>
    `
    }

    transporter.sendMail(message).then(() => {

      return res.render("activation-page", { act_message: " Activation page !", active_error });
    }).catch(error => {
      if (error) throw error;
      return res.status(500).json({ error });
    })


  } else {

    var check_pass = await bcrypt.compare(login_data.password, data[0].password);

    if (check_pass) {
      req.session.user_id = data[0].user_id;
      req.session.stud_id = studdata[0].student_id;
      req.session.email = userEmail;
      return res.redirect("/home");
    } else {
      return res.render("login.ejs", { error: "**Invalid  Password !", forgotpassword: "", login_data });
    }
  }


};

//Render Home Page------------------------------------------------

const home = async (req, res) => {
  var data = [];
  if (req.session.email) {

    let user_id = req.session.user_id;
    let user_email = req.session.email;
    var sql = `select fname from student_master where email="${user_email}"`;
    var [username] = await con.query(sql);
    username = username[0].fname;
    req.session.username = username;

    var sql1 = `select exam_name,exam_id from exam_master where exam_isActive="yes"`;
    var [examdata] = await con.query(sql1);

    var sql2 = `select exam_name,submited from exam_master,result_master where exam_master.exam_id=result_master.exam_id and exam_isActive="yes" and user_id=${user_id}`;
    var [attemptdata] = await con.query(sql2);



    let flag = 0;

    for (let i = 0; i < examdata.length; i++) {
      flag = 0;
      for (let j = 0; j < attemptdata.length; j++) {
        if (examdata[i].exam_name == attemptdata[j].exam_name) {
          if (attemptdata[j].submited == 1) {
            data.push({
              exam_id: examdata[i].exam_id,
              exam_name: examdata[i].exam_name,
              attempted: true,
              giving: false
            });
          }
          if (attemptdata[j].submited == 0) {
            data.push({
              exam_id: examdata[i].exam_id,
              exam_name: examdata[i].exam_name,
              attempted: false,
              giving: true
            });
          }
          flag = 1;
        }
      }
      if (flag == 0) {
        data.push({
          exam_id: examdata[i].exam_id,
          exam_name: examdata[i].exam_name,
          attempted: false,
          giving: false,
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
  let email_error = "";
  if (req.session.email) {
    return res.redirect('/home');
  }
  else {
    return res.render("forgotpassword", { email_error });
  }
};



const sendmail = async (req, res) => {
  let userEmail = req.body.email;


  emailExistence.check(userEmail, function (err, data) {
    console.log('res: ' + data);
    if (data) {

      // let userName = "";
      let rendom_num = Math.floor(1000000 + Math.random() * 999999);
      req.session.otp = rendom_num;
      console.log(process.env.email);
      let config = {
        service: 'gmail',
        auth: {
          user: process.env.email,
          pass: process.env.pass,
        },
      }

      let transporter = nodemailer.createTransport(config);

      let message = {
        from: process.env.email,
        to: userEmail,
        subject: 'forget password !!',
        html: `<h1>hello student forget your password using OTP !! </h1>
             <p>OTP : <strong>${rendom_num}</strong></P>
      `
      }

      transporter.sendMail(message).then(() => {

        res.render("changepassword", { otp_err: "", userEmail, password: "" });
      }).catch(error => {
        if (error) throw error;
        return res.status(500).json({ error });
      })
    } else {
      res.render("forgotpassword", { email_error: 'email id is not exist !!' })
    }
  });
  // res.status(201).json("bill successfull ...");

}


const updatepassword = async (req, res) => {
  let password = req.body.password;
  let userEmail = req.body.email;
  let otp = req.body.otp;

  const pass = await bcrypt.hash(password, 10);



  if (otp == req.session.otp) {
    var sql = `update user_master,student_master set user_master.password = '${pass}',student_master.pass='${pass}' where student_master.email = '${req.body.email}' and user_master.username='${req.body.email}'`;
    var data = await con.query(sql);

    res.render('login', { forgotpassword: "**Password update successfully!!", error: "", login_data: "" })

  } else {
    res.render("changepassword", { otp_err: "OTP is not match!!", userEmail, password });
  }
};

// Edit profile------------------------------------------------------------------
const edit = async (req, res) => {
  if (req.session.email) {
    var user_email = req.session.email;

    var sql = `select fname,lname,gender,email,mobile,enrollment,qualification,city,college,birthdate from student_master where email="${user_email}"`;
    var [studdata] = await con.query(sql);

    res.render("edit-profile", { data: studdata[0] });
  } else {
    res.redirect("/login");
  }
};

const updatedata = async (req, res) => {
  if (req.session.email) {
    var alldata = JSON.parse(req.query.newdata);


    var session = req.session;



    var user_id = session.user_id;
    var stud_id = session.stud_id;

    try {
      var sql = `update student_master set fname='${alldata.fname}', lname='${alldata.lname}', gender='${alldata.gender}', email='${alldata.email}', mobile='${alldata.phone}', enrollment='${alldata.enroll}', qualification='${alldata.qualification}', city='${alldata.city}', college='${alldata.college}', birthdate='${alldata.dob}' where student_id=${stud_id}`;
      var [result1] = await con.query(sql);

      var sql1 = `update user_master set username='${alldata.email}' where user_id=${user_id}`;
      var [result2] = await con.query(sql1);

      session.email = alldata.email;

      res.json("Update done..!");
    } catch (e) {
      console.log(e);

      res.json("Update didn't happen");
    }
  }
  else {
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
  sendmail
};
