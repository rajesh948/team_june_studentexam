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
app.set('view engine','ejs');

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Exam",
});


const query = util.promisify(conn.query).bind(conn);

conn.connect((err) => {
    if (err) throw err;
    console.log("Connected");
});


app.get('/login', function (req, res) {
    res.render('login.ejs');
});

app.post('/savedata',async(req,res)=>{
    console.log(req.body);
    var password = req.body.password;
    const pass = await bcrypt.hash(password, 10);
    console.log(pass);
    var confirmpass = await bcrypt.compare(req.body.confirmPassword, pass);
    console.log(confirmpass);

    const email_arr = [];
    var sql = `select email from student_master;`;
    var data = await query(sql);
  
    console.log(data);
    for (i = 0; i < data.length; i++) {
      email_arr.push(data[i].email);
    }
  
    console.log(email_arr);

    if (
        confirmpass == true &&
        !email_arr.includes(req.body.email)
      ) 
      
      {
        console.log("Registered!!");
        var sql = ` insert into student_master (fname,lname,gender,email,mobile,enrollment,qualification,city,college,birthdate,pass) VALUES('${req.body.fname}','${req.body.lname}','${req.body.gender}','${req.body.email}','${req.body.number}','${req.body.enrollment}','${req.body.qualification}','${req.body.city}','${req.body.college}','${req.body.dob}','${pass}');`
        console.log(sql);
        var data = await query(sql);
      }
      
      else {
        console.log("failed");
        res.redirect("http://localhost:8081/registration");
      }


    
    res.redirect('/login');
 
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

app.get('/registration', function (req, res) {
    res.render('registration.ejs');
});
app.listen(8081);
