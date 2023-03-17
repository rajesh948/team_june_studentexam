const express = require('express');
const app = express();
const ejs = require('ejs');
const mysql = require('mysql2');
const con = require('./db');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static((__dirname+ '/public')));
app.set('view engine', 'ejs');

// ---------- Register & login --------------------------------
app.get('/register', (req, res) => {    
    res.render('register');    
});

app.get('/activation-page',(req,res)=>{
    res.render('activation-page');
})

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

app.get('/exam-term',(req,res) => {
    res.render('term_condition',{a_fname:'',a_lname:'',a_email:'',a_mobilenumber:'',a_dob:'',a_city:'',a_qualification:'',a_college:'',a_accesscode:'',a_enrollment:'',fname:'',lname:'',email:'',mobilenumber:'',dob:'',city:'',qualification:'',college:'',accesscode:'',enrollment:''});
})



//---- Server-side Validation ------------------------

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
    let [a1] = await con.query(q1);
    console.log(a1[0].exam_access_code);

    let q2 = `SELECT * FROM student_master WHERE email='${email}'`
    let [a2] = await con.query(q2);

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



app.get('/exam-end',(req,res)=>{
    res.render('exam_end');
})  

app.listen(7878, () => {
    console.log('Example app listening on port 3000!');
});