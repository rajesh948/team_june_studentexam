const express = require('express');
const app = express();
const route = express.Router();
const examController = require('../controller/examController');

route.get('/exam-term',examController.exam_term);

route.get('/exam-verification',examController.exam_verification);

route.post('/term-validation-api',examController.term_validation_api);

route.get('/startexam',examController.startexam);

route.get('/getQuestion',examController.getQuestion);

route.get('/getCategory',examController.getCategory);

route.post('/saveUserResult',examController.saveUserResult);

route.get('/result',examController.result);

route.get('/getResult',examController.getResult);

route.get('/getCategoryId',examController.getCategoryId);

module.exports = route;