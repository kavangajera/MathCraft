const express = require('express');
const { check } = require('express-validator');

const questionController = require('../controllers/questions-controllers');
const router = express.Router();

router.get('/', questionController.getQuestions);

router.get('/:username/', questionController.getUserQuestions);

router.post('/:username/', questionController.createUserQuestion)

module.exports = router