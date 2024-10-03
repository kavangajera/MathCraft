const express = require('express')
const { check } = require('express-validator')

const answerController = require('../controllers/answers-controllers');
const router = express.Router()

router.get('/:username/', answerController.getQuestionOfUserWithAnswer);
router.post('/question/:questionId/answer', answerController.giveAnswerTheQuestion);
router.delete('/:answerId', answerController.deleteAnswerTheQuestion)

module.exports = router