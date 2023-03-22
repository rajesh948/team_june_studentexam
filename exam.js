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


//sumit ::::: home page backend task


app.get('/home', async (req, res) => {
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

    var sql2 = `select exam_name from exam_master,result_master where exam_master.exam_id=result_master.exam_id and submited = 1 and exam_isActive=0 and user_id=${user_id}`;
    var attemptdata = await query(sql2);

    // console.log("examdata",examdata)
    console.log("attempted Exam Data",attemptdata)

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

    res.render('home', { data, username });
  } else {
    res.redirect("/login");

  }
})




//akib and pratik:::: exam question genaration task


app.get('/exam-term', (req, res) => {

  let examid = req.query.exam_id;
  let examname = req.query.exam_name;
  req.session.exam_id = examid;
  req.session.exam_name = examname;
  if (req.session.user_id) {

    res.redirect("/exam-verification");
  } else {
    res.redirect("/login");
  }
})

app.get("/exam-verification", (req, res) => {
  // console.log("exam-verifi",req.session);
  if (req.session.exam_id) {
    let username = req.session.username;
    let examname = req.session.exam_name;
    res.render('term_condition', { examname, username, a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: '', lname: '', email: '', mobilenumber: '', dob: '', city: '', qualification: '', college: '', accesscode: '', enrollment: '' });


  } else {
    res.redirect("/login");
  }
})



//---- Server-side Validation of user verification ------------------------

app.post('/term-validation-api', async (req, res) => {
  console.log(req.body);
  let user_email = req.session.email;
  let exam_id = req.session.exam_id;
  let user_id = req.session.user_id;
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
  let username = req.session.username;
  let examname = req.session.exam_name;
if(exam_id){


  let q1 = (`SELECT exam_access_code FROM exam_master WHERE exam_id=${exam_id}`);
  // console.log(q1);
  let a1 = await query(q1);
  // console.log(a1[0].exam_access_code);

  let q2 = `SELECT * FROM student_master WHERE email='${user_email}'`
  console.log(q2);
  let a2 = await query(q2);
console.log("A2",a2);
  if (a2[0].fname == fname && a2[0].lname == lname && a2[0].email == email && a2[0].mobile == contact && a2[0].city == city && a2[0].college == college && a2[0].qualification == qualification && a2[0].enrollment == enrollment && a2[0].birthdate == dob && acess_code == a1[0].exam_access_code) {
    res.redirect('/startexam');
  }
  else if (a2[0].fname != fname) {
    res.render('term_condition', {examname,username, a_fname: 'Enter valid fname !!!', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a2[0].lname != lname) {
    res.render('term_condition', {examname,username, a_lname: 'Enter valid lname !!!', a_fname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a2[0].email != email) {
    res.render('term_condition', {examname,username, a_email: 'Enter valid email!!!', a_fname: '', a_lname: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a2[0].mobile != contact) {
    res.render('term_condition', { examname,username,a_mobilenumber: 'Enter valid mobile number!!!', a_fname: '', a_lname: '', a_email: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a2[0].city != city) {
    res.render('term_condition', {examname,username, a_city: 'Enter valid city!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a2[0].college != college) {
    res.render('term_condition', {examname,username, a_college: 'Enter valid college!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a2[0].qualification != qualification) {
    res.render('term_condition', {examname,username, a_qualification: 'Enter valid qualification!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a2[0].enrollment != enrollment) {
    res.render('term_condition', {vusername, a_enrollment: 'Enter valid enrollment!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a2[0].birthdate != dob) {
    res.render('term_condition', {examname,username, a_dob: 'Enter valid dob!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a1[0].accesscode != acess_code) {
    res.render('term_condition', {examname,username, a_accesscode: 'Enter valid access code!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
}else{
  res.redirect("/home");
}

})




//rajesh :::: exam question page backend 


var result_num=0;
app.get("/startexam", async (req, res) => {

  if (req.session.exam_id) {
  
    let exam_id = req.session.exam_id;
    let user_id = req.session.user_id;
    let username = req.session.username;
    let examname = req.session.exam_name;
    let category = [];
    let totalQue = [];

    ///result_master
    if(result_num == 0){

      await query(`insert into Exam.result_master (exam_id,user_id,obtain_mark,total_mark,question_ids,question_answers,submited) values("${exam_id}","${user_id}","${0}","${0}","${0}",'${0}','${0}');`);
    }
result_num++;


    let get_question = await query(`SELECT question_id,category_id FROM exam_category where exam_id = "${exam_id}";`);

    for (let i = 0; i < get_question.length; i++) {
      var get_cate = await query(`SELECT * FROM question_category where category_id = "${get_question[i].category_id}";`);
      totalQue = totalQue.concat(get_question[i].question_id.split(","));

      category.push(get_cate[0]);
    }

    res.render("examQuestion.ejs", { examname, username, category, totalQue });

  } else {
    res.redirect("/login");
  }
});

app.get("/getQuestion", async (req, res) => {
console.log("ghdashd");
  let exam_id = req.session.exam_id;

  let totalQue = [];
  try {

    let get_question = await query(`SELECT question_id,category_id FROM exam_category where exam_id = "${exam_id}";`);

    for (let i = 0; i < get_question.length; i++) {
      var get_cate = await query(`SELECT * FROM question_category where category_id = "${get_question[i].category_id}";`);
      totalQue = totalQue.concat(get_question[i].question_id.split(","));

    }

    var question_paper = [];
    var question_item;




    for (let i = 0; i < get_question.length; i++) {
      var get_cate = await query(`SELECT * FROM question_category where category_id = "${get_question[i].category_id}";`);
      var get_que = await query(`SELECT question_id,question,question_answer FROM Exam.question_master  where category_id = "${get_question[i].category_id}";`);
      var questions = [];

      // console.log(i + "get_que ::::", get_que);

      for (let j = 0; j < get_que.length; j++) {
        // console.log("totalQue::::::::::::::::",totalQue);
        // console.log("get_que[j].question_id)::::::::",get_que[j].question_id)
        // console.log(totalQue.includes(`${get_que[j].question_id}`));
        if (totalQue.includes(`${get_que[j].question_id}`)) {
          var get_option = await query(`SELECT option_value FROM Exam.option_master where question_id="${get_que[j].question_id}";`)

          // console.log('get_option :::::::::', get_option)


          var option = [];
          for (let n = 0; n < get_option.length; n++) {
            option.push(get_option[n].option_value);
          }

          questions.push({
            question_id: `${get_que[j].question_id}`,
            question: `${get_que[j].question}`,
            option: option
          });


          question_item = {
            category_id: `${get_cate[0].category_id}`,
            category_name: `${get_cate[0].category_name}`,
            allquestion: questions
          };
        }

      }

      question_paper.push(question_item);
    }

    console.log("question_paper :::::::::", question_paper);
    // console.log("question_paper[0].allquestion :::::::::", question_paper[0].allquestion);


    res.send(question_paper);
  } catch (err) {
    console.log(err);
  }
})

app.get("/getCategory", async (req, res) => {

  let exam_id = req.session.exam_id;
  let cat_id = req.query.cat_id;
  console.log("exam_id ::::::::", exam_id);
  console.log("cat_id :::::::::::::", cat_id);
  let category_no = 1;
  let get_question = await query(`SELECT category_count,category_id  FROM exam_category where exam_id=${exam_id};`);
  console.log(get_question);
  for (let i = 0; i < get_question.length; i++) {
    if (cat_id == get_question[i].category_id) {
      break;
    }
    category_no += get_question[i].category_count;
  }



  res.send({ category_no });


});


app.post("/saveUserResult", async (req, res) => {

  let question = [];
  let answer = [];
  let marks = 0;
  let total;
  let exam_id = req.session.exam_id;
  let user_id = req.session.user_id;
  console.log("req.body anser",req.body);
  // console.log("req.body que",req.body.user_que);
  if (req.body.user_que.length) {
    for (let i = 0; i < req.body.user_que.length; i++) {
      if (req.body.user_ans[i] && req.body.user_ans[i] != '0') {
        question.push(req.body.user_que[i]);
        answer.push(req.body.user_ans[i]);
      }
    }
// for(let i=0;i<req.body.user_ans.length;i++){
//   if(req.body.user_ans[i]){
     
//   }
// }

    // console.log("cdqdfwe", question);
    // console.log("efswert", answer);



    let get_result = await query(`SELECT count(question_answer) as count FROM question_master where question_id in (${question}) and question_answer in (${answer});`);
    marks = get_result[0].count;
  }

  let total_que = await query(`SELECT exam_total_question as total FROM Exam.exam_master where exam_id = "${req.session.exam_id}";`);
// console.log("total_que ::::::",total_que);
  total = total_que[0].total;

  // console.log(marks);
  // console.log(total);
  await query(`UPDATE  result_master SET obtain_mark="${marks}",total_mark="${total}",question_ids="${question}",question_answers='${answer}' where user_id =${user_id} and exam_id=${exam_id} ;`);

  res.send({ message: "inserted" });


})


app.get("/getResult",async(req,res)=>{
  if(req.session.exam_id){
    let exam_id = req.session.exam_id;
    let user_id = req.session.user_id;
   let data= await query(`select question_ids,question_answers from result_master where user_id =${user_id} and exam_id=${exam_id};`);  
   if(data[0]){
   if(data[0].question_ids != "0"){
    console.log("getResult Data",data[0]);
    console.log("data[0].question_ids",data[0].question_ids);
    console.log("data[0].question_ids",data[0].question_answers);
    res.send({user_que:data[0].question_ids.split(","),user_ans:data[0].question_answers.split(",")});
   }else{

     res.send({user_que:[1],user_ans:[1]});
   }
  }else{
    res.send({hi:"hello"});
  }}

});

app.get("/result", async (req, res) => {
  console.log(req.session)
  // let user_id = req.session.user_id;
  // let email = req.session.email;
  // let username = req.session.username;
  // let 
  if (req.session.exam_id) {
    let exam_id = req.session.exam_id;
    let user_id = req.session.user_id;
    let data= await query(`UPDATE result_master SET submited = "1" where exam_id = "${exam_id}" AND user_id ="${user_id}"; `);  

    res.render("thankyou.ejs", { username: req.session.username });
  } else {
    res.redirect("/login");
  }

})

app.listen(8081);
