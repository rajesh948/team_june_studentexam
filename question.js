const { render } = require('ejs');
const express = require('express');
const mysql = require('mysql2');
const app = express();
const util = require('util');
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Database Connection

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Exam'
});

con.connect((err) => {
    if (err) { console.log(err); }
    console.log("success connection");

});


const sendquery = util.promisify(con.query.bind(con));


app.get("/questionpage", async (req, res) => {
        
    let exam_id = req.query.exam_id;
     exam_id = 1;
     let category = [];
     let totalQue=[];
    let get_question = await sendquery(`SELECT question_id,category_id FROM exam_category where exam_id = "${exam_id}";`);

    for (let i = 0; i < get_question.length; i++) {
    var get_cate = await sendquery(`SELECT * FROM question_category where category_id = "${get_question[i].category_id}";`);
      totalQue = totalQue.concat(get_question[i].question_id.split(","));
      
      category.push(get_cate[0]);
    }

    res.render("examQuestion.ejs",{category,totalQue});
});

app.get("/getQuestion",async(req,res)=>{
    
    let exam_id = req.query.exam_id;
     exam_id = 1;
     let totalQue=[];
    try {

        let get_question = await sendquery(`SELECT question_id,category_id FROM exam_category where exam_id = "${exam_id}";`);

        for (let i = 0; i < get_question.length; i++) {
            var get_cate = await sendquery(`SELECT * FROM question_category where category_id = "${get_question[i].category_id}";`);
              totalQue = totalQue.concat(get_question[i].question_id.split(","));

            }

        var question_paper = [];
        var question_item;




        for (let i = 0; i < get_question.length; i++) {
            var get_cate = await sendquery(`SELECT * FROM question_category where category_id = "${get_question[i].category_id}";`);
            var get_que = await sendquery(`SELECT question_id,question,question_answer FROM Exam.question_master  where category_id = "${get_question[i].category_id}";`);
            var questions = [];

            console.log(i + "get_que ::::", get_que);

            for (let j = 0; j < get_que.length; j++) {
                // console.log("totalQue::::::::::::::::",totalQue);
                // console.log("get_que[j].question_id)::::::::",get_que[j].question_id)
                // console.log(totalQue.includes(`${get_que[j].question_id}`));
                if(totalQue.includes(`${get_que[j].question_id}`)){
                var get_option = await sendquery(`SELECT option_value FROM Exam.option_master where question_id="${get_que[j].question_id}";`)

                console.log('get_option :::::::::', get_option)


                var option = [];
                for (let n = 0; n < get_option.length; n++) {
                    option.push(get_option[n].option_value);
                }

                questions.push({
                    question_id: `${get_que[j].question_id}`,
                    question: `${get_que[j].question}`,
                    option: option,
                    answer: `${get_que[j].question_answer}`
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
        console.log("question_paper[0].allquestion :::::::::", question_paper[0].allquestion);

 
res.send(question_paper);
    } catch (err) {
        console.log(err);
    }
})

app.get("/getCategory", async (req, res) => {
        
    let exam_id = req.query.exam_id || 1;
    let cat_id = req.query.cat_id || 2;
    console.log("exam_id ::::::::",exam_id);
    console.log("cat_id :::::::::::::",cat_id);
   let category_no=1;
    let get_question = await sendquery(`SELECT category_count,category_id  FROM exam_category where exam_id=${exam_id};`);
console.log(get_question);
    for (let i = 0; i < get_question.length; i++) {
    if(cat_id ==  get_question[i].category_id){
        break;
    }
        category_no += get_question[i].category_count;
    }



    res.send({category_no});


});

app.listen(3435);