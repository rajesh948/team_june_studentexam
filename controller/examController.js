const { log } = require('util');
const con = require('../db');



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
      var [get_que] = await con.query(`SELECT question_id,question,question_answer FROM Exam.question_master  where category_id = "${get_question[i].category_id}";`);
      var questions = [];

      for (let j = 0; j < get_que.length; j++) {
        
        if (totalQue.includes(`${get_que[j].question_id}`)) {
          var [get_option] = await con.query(`SELECT option_value FROM Exam.option_master where question_id="${get_que[j].question_id}";`)

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

  let [total_que] = await con.query(`SELECT exam_total_question as total FROM Exam.exam_master where exam_id = "${req.session.exam_id}";`);
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
    // console.log("data::::::::::::;",data);
   if(data[0]){
   if(data[0].question_ids != "0"){
    res.send({user_que:data[0].question_ids.split(","),user_ans:data[0].question_answers.split(",")});
   }else{

     res.send({user_que:[1],user_ans:[1]});
   }
  }else{
    res.send({hi:"hello"});
  }}
  
  }



module.exports = {startexam,getQuestion,getCategory,saveUserResult,result,getResult};