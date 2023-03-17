var express = require("express");
var bodyParser = require("body-parser");

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


app.get('/home', (req, res) => {
  res.render('home');
})


app.listen(PORT);

