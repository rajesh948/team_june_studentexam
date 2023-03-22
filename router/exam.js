const express = require('express');
const app = express();
const route = express.Router();
const examController = require('../controller/examController');



route.get('/getQuestion',examController.getQuestion);

route.get('/getCategory',examController.getCategory);

route.post('/saveUserResult',examController.saveUserResult);

route.get('/getResult',examController.getResult);

module.exports = route;