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

      await query(`insert into Exam.result_master (exam_id,user_id,obtain_mark,total_mark,question_ids,question_answers) values("${exam_id}","${user_id}","${0}","${0}","${0}",'${0}');`);
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
  console.log("req.body que",req.body.user_que);
  if (req.body.user_que.length) {
    for (let i = 0; i < req.body.user_que.length; i++) {
      if (req.body.user_ans[i]) {
        question.push(req.body.user_que[i]);
        answer.push(req.body.user_ans[i]);
      }
    }
// for(let i=0;i<req.body.user_ans.length;i++){
//   if(req.body.user_ans[i]){
     
//   }
// }

    console.log("cdqdfwe", question);
    console.log("efswert", answer);



    let get_result = await query(`SELECT count(question_answer) as count FROM question_master where question_id in (${question}) and question_answer in (${answer});`);
    marks = get_result[0].count;
  }

  let total_que = await query(`SELECT exam_total_question as total FROM Exam.exam_master where exam_id = "${req.session.exam_id}";`);
console.log("total_que ::::::",total_que);
  total = total_que[0].total;

  console.log(marks);
  console.log(total);
  await query(`UPDATE  result_master SET obtain_mark="${marks}",total_mark="${total}",question_ids="${question}",question_answers='${answer}' where user_id =${user_id} and exam_id=${exam_id} ;`);

  res.send({ message: "inserted" });


})


app.get("/getResult",async(req,res)=>{
  if(req.session.exam_id){
    let exam_id = req.session.exam_id;
    let user_id = req.session.user_id;
   let data= await query(`select question_ids,question_answers from result_master where user_id =${user_id} and exam_id=${exam_id};`);  
   console.log("getResult Data",data);
   console.log("data[0].question_ids",data[0].question_ids);
   console.log("data[0].question_ids",data[0].question_answers);
   res.send({user_que:data[0].question_ids.split(","),user_ans:data[0].question_answers.split(",")});
  }else{
    res.send({hi:"hello"});
  }

});

app.get("/result", (req, res) => {
  if (req.session.exam_id) {
//     req.session.destroy(req.session.exam_id,(err) => {
//   if(err){
//     return console.error(err);
//   }
//   console.log("The session has been destroyed!");
// });

    res.render("thankyou.ejs", { username: req.session.username });
  } else {
    res.redirect("/login");
  }

})

app.listen(8081);
