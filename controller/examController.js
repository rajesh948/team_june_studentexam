const { log } = require('util');
const con = require('../db');

//Set exam_id & exam_name ----------------------------------------------------------------

exam_term = async (req, res) => {
  let examid = req.query.exam_id;
  let examname = req.query.exam_name;
  req.session.exam_id = examid;
  req.session.exam_name = examname;

  if (req.session.user_id) {
    res.redirect("/exam-verification");
  } else {
    res.redirect("/login");
  }
}

// Render term_condition and acess_code verification page----------------------------------

exam_verification = async (req, res) => {
  if (req.session.user_id && req.session.exam_id) {
    let username = req.session.username;
    let examname = req.session.exam_name;

    var sql = `select exam_duration from exam_master where exam_name = '${examname}'`;

    var time = await con.query(sql);
    
    time = time[0][0].exam_duration;

    res.render('term_condition', { examname, username, a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: '', lname: '', email: '', mobilenumber: '', dob: '', city: '', qualification: '', college: '', accesscode: '', enrollment: '',time});

  } else {
    res.redirect("/login");
  }
}

// Verify term_condition and acess_code verification page----------------------------------

term_validation_api = async (req, res) => {

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

  let q1 = (`SELECT exam_access_code FROM exam_master WHERE exam_id=${exam_id}`);
  let [a1] = await con.query(q1);
 
  let q2 = `SELECT * FROM student_master WHERE email='${user_email}'`
  let [a2] = await con.query(q2);

  var sql = `select exam_duration from exam_master where exam_name = '${examname}'`;

    var time = await con.query(sql);
    
    time = time[0][0].exam_duration;

  if (a2[0].fname == fname && a2[0].lname == lname && a2[0].email == email && a2[0].mobile == contact && a2[0].city == city && a2[0].college == college && a2[0].qualification == qualification && a2[0].enrollment == enrollment && a2[0].birthdate == dob && acess_code == a1[0].exam_access_code) {
    res.redirect('/startexam');
  }
  else if (a2[0].fname != fname) {
    res.render('term_condition', {examname,username, a_fname: 'Enter valid fname !!!', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment,time});
  }
  else if (a2[0].lname != lname) {
    res.render('term_condition', {examname,username, a_lname: 'Enter valid lname !!!', a_fname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment,time });
  }
  else if (a2[0].email != email) {
    res.render('term_condition', {examname,username, a_email: 'Enter valid email!!!', a_fname: '', a_lname: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment,time});
  }
  else if (a2[0].mobile != contact) {
    res.render('term_condition', { examname,username,a_mobilenumber: 'Enter valid mobile number!!!', a_fname: '', a_lname: '', a_email: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment,time });
  }
  else if (a2[0].city != city) {
    res.render('term_condition', {examname,username, a_city: 'Enter valid city!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment,time});
  }
  else if (a2[0].college != college) {
    res.render('term_condition', {examname,username, a_college: 'Enter valid college!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment,time});
  }
  else if (a2[0].qualification != qualification) {
    res.render('term_condition', {examname,username, a_qualification: 'Enter valid qualification!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment,time});
  }
  else if (a2[0].enrollment != enrollment) {
    res.render('term_condition', {examname,username, a_enrollment: 'Enter valid enrollment!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment,time});
  }
  else if (a2[0].birthdate != dob) {
    res.render('term_condition', {examname,username, a_dob: 'Enter valid dob!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment,time});
  }
  else if (a1[0].accesscode != acess_code) {
    res.render('term_condition', {examname,username, a_accesscode: 'Enter valid access code!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment,time});
  }

}
//Display Question Page --------------------------------------------------------------------------------------

var result_num = 0;
startexam =  async (req, res) => {
  
  if (req.session.user_id && req.session.exam_id) {
    let user_id = req.session.user_id;
    let exam_id = req.session.exam_id;
    let username = req.session.username;
    let examname = req.session.exam_name;
    let category = [];
    let totalQue = [];

    if(result_num == 0){
      await con.query(`insert into Exam.result_master (exam_id,user_id,obtain_mark,total_mark,question_ids,question_answers,submited) values("${exam_id}","${user_id}","${0}","${0}","${0}",'${0}','${0}');`);
    }
result_num++;
    let [get_question] = await con.query(`SELECT question_id,category_id FROM exam_category where exam_id = "${exam_id}";`);

    for (let i = 0; i < get_question.length; i++) {
      var [get_cate] = await con.query(`SELECT * FROM question_category where category_id = "${get_question[i].category_id}";`);
    
      totalQue = totalQue.concat(get_question[i].question_id.split(","));

      category.push(get_cate[0]);
    }

    let [exam_duration] = await con.query(`SELECT exam_duration FROM exam_master where exam_id ="${exam_id}";`);

    res.render("examQuestion.ejs", { examname, username, category, totalQue,exam_duration:exam_duration[0].exam_duration });

  }  else {
    res.redirect("/login");
  }
}

//Display questions --------------------------------------------------------
 
getQuestion = async (req, res) => {

  let exam_id = req.session.exam_id;
  let totalQue = [];
  try {

    let [get_question] = await con.query(`SELECT question_id,category_id FROM exam_category where exam_id = "${exam_id}";`);
    for (let i = 0; i < get_question.length; i++) {
      var [get_cate] = await con.query(`SELECT * FROM question_category where category_id = "${get_question[i].category_id}";`);
      totalQue = totalQue.concat(get_question[i].question_id.split(","));

    }



    var question_paper = [];
    var question_item;

    for (let i = 0; i < get_question.length; i++) {
      var [get_cate] = await con.query(`SELECT * FROM question_category where category_id = "${get_question[i].category_id}";`);
      var [get_que] = await con.query(`SELECT question_id,question,question_answer FROM question_master  where category_id = "${get_question[i].category_id}";`);
      var questions = [];

      for (let j = 0; j < get_que.length; j++) {
        
        if (totalQue.includes(`${get_que[j].question_id}`)) {
          var [get_option] = await con.query(`SELECT option_value FROM option_master where question_id="${get_que[j].question_id}";`)

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

    res.send(question_paper);
  } catch (err) {
    console.log(err);
  }
}

//Display categories of questions ------------------------------------------

getCategory = async (req, res) => {

  let exam_id = req.session.exam_id;
  let cat_id = req.query.cat_id;
  let category_no = 1;
  let [get_question] = await con.query(`SELECT category_count,category_id  FROM exam_category where exam_id=${exam_id};`);
  
  for (let i = 0; i < get_question.length; i++) {
    if (cat_id == get_question[i].category_id) {
      break;
    }
    category_no += get_question[i].category_count;
  }
  res.send({ category_no });

}

//get category id api ........................................

getCategoryId = async (req,res)=>{
  let exam_id = req.session.exam_id;
  let que_id = req.query.que_no;
  let [get_categoryId] = await con.query(`SELECT category_id FROM question_master where question_id =${que_id};`);

  res.send(get_categoryId);
  
}

// Save user results --------------------------------

saveUserResult = async (req, res) => {

  let question = [];
  let answer = [];
  let marks = 0;
  let total;
  let exam_id = req.session.exam_id;
  let user_id = req.session.user_id;

  if (req.body.user_que.length) {
    for (let i = 0; i < req.body.user_que.length; i++) {
      if (req.body.user_ans[i] && req.body.user_ans[i] != '0') {
        question.push(req.body.user_que[i]);
        answer.push(req.body.user_ans[i]);
      }
    }

    let [get_result] = await con.query(`SELECT count(question_answer) as count FROM question_master where question_id in (${question}) and question_answer in (${answer});`);
    marks = get_result[0].count;
  }

  let [total_que] = await con.query(`SELECT exam_total_question as total FROM exam_master where exam_id = "${req.session.exam_id}";`);
  total = total_que[0].total;

  await con.query(`UPDATE  result_master SET obtain_mark="${marks}",total_mark="${total}",question_ids="${question}",question_answers='${answer}' where user_id =${user_id} and exam_id=${exam_id} ;`);

  res.send({ message: "inserted" });

}


// Get results ----------------------------------------------------------------

getResult = async(req,res)=>{
  if(req.session.exam_id){
    let exam_id = req.session.exam_id;
    let user_id = req.session.user_id;
    let [data]= await con.query(`select question_ids,question_answers from result_master where user_id =${user_id} and exam_id=${exam_id};`);  

   if(data[0]){
   if(data[0].question_ids != "0"){
    res.send({user_que:data[0].question_ids.split(","),user_ans:data[0].question_answers.split(",")});
   }else{

     res.send({user_que:[],user_ans:[]});
   }
  }else{
    res.send({hi:"hello"});
  }}
//   return res.redirect("/login");

}


// Thank You Page ----------------------------------------------------------------

result = async (req, res) => {
  if (req.session.exam_id) {


    let exam_id = req.session.exam_id;
    let user_id = req.session.user_id;
    let data= await con.query(`UPDATE result_master SET submited = "1" where exam_id = "${exam_id}" AND user_id ="${user_id}"; `);  
    res.render("thankyou.ejs", { username: req.session.username });
  } else {
    res.redirect("/login");
  }
}

module.exports = {exam_term,exam_verification,term_validation_api,startexam,getQuestion,getCategory,saveUserResult,result,getResult,getCategoryId};