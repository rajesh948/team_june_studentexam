const express = require("express");
const mysql = require("mysql2");

const app = express();
const bodyparser = require('body-parser');
const { json } = require('express/lib/response');
const req = require('express/lib/request');
const bcrypt = require('bcryptjs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('images'));


app.use(bodyparser.json());


const sqlconnect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'exam_stu'
});
app.set('views engine', 'ejs');


function queryDb(query) {
    return new Promise((resolve, reject) => {
        sqlconnect.query(query, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(query);
        });
    })
}





app.set('views engine', 'ejs');
app.get('/login', function (req, res) {
    res.render('login.ejs');
});


app.get('/registration', function (req, res) {
    res.render('registration.ejs');
});







app.get('/page5', function (req, res) {
  
    res.render('page5.ejs',{a_fname:'',a_lname:'',a_email:'',a_mobilenumber:'',a_dob:'',a_city:'',a_qualification:'',a_college:'',a_accesscode:'',a_enrollment:'',fname:'',lname:'',email:'',mobilenumber:'',dob:'',city:'',qualification:'',college:'',accesscode:'',enrollment:''});
});


// app.post('/exam_start',  function (req, res) {
//     const fname = req.body.fname;
//     const lname = req.body.lname;
//     const email = req.body.email;
//     const mobile = req.body.mobile;
//     const college = req.body.college;
//     const inlineRadioOptions = req.body.inlineRadioOptions;
//     const Qualifaction = req.body.Qualifaction;
//     const city = req.body.city;
//     const password = req.body.password;
//     const enroll = req.body.enroll;
//     const date = req.body.date;
//     console.log(password);
    
//     var hashedPassword;
//     bcrypt.genSalt(10, function (err, Salt) {
//     // The bcrypt is used for encrypting password.
//         bcrypt.hash(password, Salt, function (err, hash) {
//             if (err) {
//                 return console.log('Cannot encrypt');
//             }
//             hashedPassword = hash;
//             console.log(hashedPassword);
//         })
    
//     })
//     console.log("fnamelog",fname);
    
//   async function getreg() {
//         try {
           
//             const insert_users_query = `INSERT INTO student_master (fname, lname,) VALUES ('${fname}','${lname}', '${inlineRadioOptions}','${email}','${mobile}','${enroll}','${Qualifaction}','${city}','${enroll}',')`;
//             const result = await queryDb(insert_users_query);
//             console.log(result);
//             let c_id = result.insertId;
           
//             res.json(result1);


//         }
//         catch (e) { }
//     }


//     getreg();

// })

app.post('/term-validation-api',async (req,res)=>{
    let exam_id = 1;
    let id = 1;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let contact = req.body.mobilenumber;
    let dob = req.body.dob;
    let city = req.body.city;
    let college = req.body.college;
    let enrollment = req.body.enrollment;
    let qualification = req.body.qualification;
    let acess_code = req.body.accesscode;

    let q1 = (`SELECT exam_access_code FROM exam_master WHERE exam_id=${exam_id}`);
    console.log(q1);
    let [a1] =  queryDb(q1);
    console.log(a1[0].exam_access_code);

    let q2 = `SELECT * FROM student_master WHERE email='${email}'`
    let [a2] = queryDb(q2);

    if(a2.length == 1){
        if(a2[0].fname == fname && a2[0].lname == lname && a2[0].email == email && a2[0].mobile == contact &&  a2[0].city == city && a2[0].college == college && a2[0].qualification == qualification && a2[0].enrollment == enrollment && a2[0].birthdate == dob && acess_code == a1[0].exam_access_code)  {
            res.render('exam_start');
        }
        else if(a2[0].fname != fname){
            res.render('term_condition',{a_fname:'Enter valid fname !!!',a_lname:'',a_email:'',a_mobilenumber:'',a_dob:'',a_city:'',a_qualification:'',a_college:'',a_accesscode:'',a_enrollment:'',fname:fname,lname:lname,email:email,mobilenumber:contact,dob:dob,city:city,qualification:qualification,college:college,accesscode:acess_code,enrollment:enrollment});
        }
        else if(a2[0].lname != lname){
            res.render('term_condition',{a_lname:'Enter valid lname !!!',a_fname:'',a_email:'',a_mobilenumber:'',a_dob:'',a_city:'',a_qualification:'',a_college:'',a_accesscode:'',a_enrollment:'',fname:fname,lname:lname,email:email,mobilenumber:contact,dob:dob,city:city,qualification:qualification,college:college,accesscode:acess_code,enrollment:enrollment});
        }
        else if(a2[0].email!= email){
            res.render('term_condition',{a_email:'Enter valid email!!!',a_fname:'',a_lname:'',a_mobilenumber:'',a_dob:'',a_city:'',a_qualification:'',a_college:'',a_accesscode:'',a_enrollment:'',fname:fname,lname:lname,email:email,mobilenumber:contact,dob:dob,city:city,qualification:qualification,college:college,accesscode:acess_code,enrollment:enrollment});
        }
        else if(a2[0].mobile!= contact){
            res.render('term_condition',{a_mobilenumber:'Enter valid mobile number!!!',a_fname:'',a_lname:'',a_email:'',a_dob:'',a_city:'',a_qualification:'',a_college:'',a_accesscode:'',a_enrollment:'',fname:fname,lname:lname,email:email,mobilenumber:contact,dob:dob,city:city,qualification:qualification,college:college,accesscode:acess_code,enrollment:enrollment});
        }
        else if(a2[0].city!= city){
            res.render('term_condition',{a_city:'Enter valid city!!!',a_fname:'',a_lname:'',a_email:'',a_mobilenumber:'',a_dob:'',a_qualification:'',a_college:'',a_accesscode:'',a_enrollment:'',fname:fname,lname:lname,email:email,mobilenumber:contact,dob:dob,city:city,qualification:qualification,college:college,accesscode:acess_code,enrollment:enrollment});
        }
        else if(a2[0].college!= college){
            res.render('term_condition',{a_college:'Enter valid college!!!',a_fname:'',a_lname:'',a_email:'',a_mobilenumber:'',a_dob:'',a_city:'',a_qualification:'',a_accesscode:'',a_enrollment:'',fname:fname,lname:lname,email:email,mobilenumber:contact,dob:dob,city:city,qualification:qualification,college:college,accesscode:acess_code,enrollment:enrollment});
        }
        else if(a2[0].qualification!= qualification){
            res.render('term_condition',{a_qualification:'Enter valid qualification!!!',a_fname:'',a_lname:'',a_email:'',a_mobilenumber:'',a_dob:'',a_city:'',a_college:'',a_accesscode:'',a_enrollment:'',fname:fname,lname:lname,email:email,mobilenumber:contact,dob:dob,city:city,qualification:qualification,college:college,accesscode:acess_code,enrollment:enrollment});
        }
        else if(a2[0].enrollment!= enrollment){
            res.render('term_condition',{a_enrollment:'Enter valid enrollment!!!',a_fname:'',a_lname:'',a_email:'',a_mobilenumber:'',a_dob:'',a_city:'',a_qualification:'',a_college:'',a_accesscode:'',fname:fname,lname:lname,email:email,mobilenumber:contact,dob:dob,city:city,qualification:qualification,college:college,accesscode:acess_code,enrollment:enrollment});
        }
        else if(a2[0].birthdate!= dob){
            res.render('term_condition',{a_dob:'Enter valid dob!!!',a_fname:'',a_lname:'',a_email:'',a_mobilenumber:'',a_city:'',a_qualification:'',a_college:'',a_accesscode:'',a_enrollment:'',fname:fname,lname:lname,email:email,mobilenumber:contact,dob:dob,city:city,qualification:qualification,college:college,accesscode:acess_code,enrollment:enrollment});
        }
        else if(a1[0].accesscode != acess_code) {
            res.render('term_condition',{a_accesscode:'Enter valid access code!!!',a_fname:'',a_lname:'',a_email:'',a_mobilenumber:'',a_dob:'',a_city:'',a_qualification:'',a_college:'',a_enrollment:'',fname:fname,lname:lname,email:email,mobilenumber:contact,dob:dob,city:city,qualification:qualification,college:college,accesscode:acess_code,enrollment:enrollment});
        }
    }
    else{
            res.render('term_condition',{a_email:'Enter valid email!!!',a_fname:'',a_lname:'',a_mobilenumber:'',a_dob:'',a_city:'',a_qualification:'',a_college:'',a_accesscode:'',a_enrollment:'',fname:fname,lname:lname,email:email,mobilenumber:contact,dob:dob,city:city,qualification:qualification,college:college,accesscode:acess_code,enrollment:enrollment});        
        }
})


app.post('/savedata',async(req,res)=>{
    console.log(req.body);
    var password = req.body.password;
    const pass = await bcrypt.hash(password, 10);
    console.log(pass);
    var confirmpass = await bcrypt.compare(req.body.confirmPassword, pass);
    console.log(confirmpass);

    const email_arr = [];
    var sql = `select email from student_master;`;
    var data = await queryDb(sql);
  
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
        var data = await queryDb(sql);
      }
      
      else {
        console.log("failed");
        res.redirect("http://localhost:8081/registration");
      }


    
    res.redirect('/login');
 
})

app.listen(8081);
