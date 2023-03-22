const express = require('express');
const app = express();
const route = express.Router();
const examController = require('../controller/examController');



route.get('/startexam',examController.startexam);

route.get('/result',examController.result);



module.exports = route;