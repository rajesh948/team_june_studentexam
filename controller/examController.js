const { log } = require('util');
const con = require('../db');


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

    res.render("examQuestion.ejs", { examname, username, category, totalQue });

  }  else {
    res.redirect("/login");
  }
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

module.exports = {exam_term,exam_verification,term_validation_api,startexam,getQuestion,getCategory,saveUserResult,result,getResult};