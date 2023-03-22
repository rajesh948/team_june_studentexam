const express = require('express');
const app = express();
const route = express.Router();
const examController = require('../controller/examController');

route.get('/exam-term',examController.exam_term);

route.get('/exam-verification',examController.exam_verification);

route.post('/term-validation-api',examController.term_validation_api);


module.exports = route;