const express = require('express');
const app = express();
const ejs = require('ejs');
const mysql = require('mysql2');

app.use(express.static((__dirname+ '/public')));
app.set('view engine', 'ejs');

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'exam_system'
});

con.connect();


app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    con.query('select * from college_master',(err, result) => {
        if(err) throw err;
        res.render('register',{result: result});
    })
    
});

app.get('/activation-page',(req,res)=>{
    res.render('activation-page');
})

app.get('/college-api', (req,res) => {
    con.query('select * from college_master',(err, result) => {
        if(err) throw err;
        res.render(result);
    })
})

app.listen(7070, () => {
    console.log('Example app listening on port 3000!');
});