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

//session middleware
app.use(sessions({
  secret: "secretkey",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));


const query = util.promisify(conn.query).bind(conn);

conn.connect((err) => {
  if (err) throw err;
  console.log("Connected");
});

//nandani :::: registration and login backend task

app.get('/registration', function (req, res) {
  if (req.session.user_id) {
    res.redirect("/home");
  } else {
    res.render('registration.ejs');
  }

});

app.post('/registration', async (req, res) => {
  console.log(req.body);
  var password = req.body.password;
  const pass = await bcrypt.hash(password, 10);
  console.log(pass);
  var confirmpass = await bcrypt.compare(req.body.confirmPassword, pass);
  console.log(confirmpass);

  const email_arr = [];
  var sql = `select email from student_master;`;
  var data = await query(sql);

  console.log("data nsfs ::", data);
  for (i = 0; i < data.length; i++) {
    email_arr.push(data[i].email);
  }

  console.log(email_arr);

  if (confirmpass == true && !email_arr.includes(req.body.email)) {
    console.log("Registered!!");
    var sql = ` insert into student_master (fname,lname,gender,email,mobile,enrollment,qualification,city,college,birthdate,pass) VALUES('${req.body.fname}','${req.body.lname}','${req.body.gender}','${req.body.email}','${req.body.number}','${req.body.enrollment}','${req.body.qualification}','${req.body.city}','${req.body.college}','${req.body.dob}','${pass}');`
    console.log(sql);
    var data = await query(sql);
    insertId = data.insertId;
    console.log("insertId", insertId);


    var user_sql = `insert into user_master (username,password,role,isActive) values ('${req.body.email}','${pass}','student','0');`

    console.log(user_sql);
    var data = await query(user_sql);
    insertId1 = data.insertId;
    console.log(insertId1);

    res.render("activation-page", { user_id: insertId1, act_message: "Thank you for Registering!" });
  } else {
    console.log("failed");
    res.redirect("/registration");
  }
})


app.get("/activation", async (req, res) => {
  var user_id = req.query.user_id;
  console.log("dasse",user_id);
  if (user_id) {
    var sql = `update user_master set isActive = 1 where user_id =${user_id};`
    var data = await query(sql);
    console.log(sql);
  }
  console.log("hello");
  res.redirect('/login');


})

app.get('/login', (req, res) => {
  // console.log("user_id Session", req.session.user_id);
  // console.log("email session:::", req.session.email);
  if (req.session.user_id) {
    res.redirect("/home");

  } else {
    res.render("login.ejs", { error: "", forgotpassword:"" });
  }
})

app.get('/modal',(req,res)=>{
  res.render('bs');
})

app.post("/login", async (req, res) => {


  let login_data = req.body;
  console.log(req.body);

  var data = await query(`select user_id,password,isActive from user_master where username = "${login_data.email}"`);
  console.log(data);
  if (!data[0]) {
    return res.render("login.ejs", { error: "**Envalid Email Or Password !" ,forgotpassword:""});
  }
  if (data[0].isActive == 0) {
    return res.render("activation-page", { user_id: data[0].user_id, act_message: "Your Account Is Not Active!" });
  }
  var check_pass = await bcrypt.compare(login_data.Password, data[0].password);
  console.log(check_pass);
  if (check_pass) {
    let session = req.session;
    session.user_id = data[0].user_id;
    session.email = login_data.email;
    res.redirect("/home");
  } else {
    res.render("login.ejs", { error: "**Envalid Email Or Password !",forgotpassword:"" });
  }
});

app.post('/updatepassword',async (req,res)=>{
  var password = req.body.password;
  console.log(password);
  const pass = await bcrypt.hash(password, 10);
  console.log(pass);
  var confirmpass = await bcrypt.compare(req.body.confirmPassword, pass);
  console.log(confirmpass);

  if(confirmpass==true){
    var sql = `update user_master,student_master set user_master.password = '${pass}',student_master.pass='${pass}' where student_master.email = '${req.body.email}' and user_master.username='${req.body.email}'`
    // var data = await query(sql);
    console.log(sql);
    res.render('login',{forgotpassword:"**Password reset successfully!!",error:""})

  }
})

app.get("/verify", async (req, res) => {
  const email_arr = [];
  var sql = `select email from student_master;`;
  var data = await query(sql);
  for (i = 0; i < data.length; i++) {
    email_arr.push(data[i].email);
  }

  res.json(email_arr);
});


app.get("/logout", (req, res) => {
  req.session.destroy();
  console.log("logout", req.session);
  res.redirect("/login");
});

app.get('/forgotpassword',(req,res)=>{
  res.render('forgotpassword');
})


app.listen(8081);
