var express = require("express");
var bodyParser = require("body-parser");

var mysql = require("mysql2");
const util = require("util");


var app = express();

var PORT = 3000;


// View engine setup
app.set("view engine", "ejs");


app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: false,
  })
);

app.use(express.static(__dirname + "/public"));


var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "examportal",
  port: 3306,
});

var query = util.promisify(conn.query).bind(conn);



app.get(['/', '/home'], async (req, res) => {
  var data = [];

  var sql1 = `select exam_name from exam_master where exam_isActive=0`;
  var examdata = await query(sql1);

  var sql2 = `select exam_name,isAttempt from exam_master,attemptedExam where exam_master.exam_id=attemptedExam.exam_id and exam_isActive=0 and std_id=1`;
  var attemptdata = await query(sql2);

  console.log(examdata)
  console.log(attemptdata)

  for (let i = 0; i < examdata.length; i++) {
    for (let j = 0; j < attemptdata.length; j++) {
      if (examdata[i].exam_name == attemptdata[j].exam_name) {
        if (attemptdata[j].isAttempt == 1) {
          data.push({ 'exam_name': examdata[i].exam_name, 'attempted': true })
        }
        if (attemptdata[j].isAttempt == 0) {
          data.push({ 'exam_name': examdata[i].exam_name, 'attempted': false })
        }
        break
      }
    }
  }
  console.log(data)

  res.render('home', { data });
})


app.listen(PORT);

