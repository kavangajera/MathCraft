const express = require('express')
const { check } = require('express-validator')

const answerController = require('../controllers/answers-controllers');
const userController = require('../controllers/users-controllers')
const router = express.Router()

// router.get('/:username/', answerController.getAllAnswersOfUser);
router.get('/:questionId',answerController.getAllAnswersOfQuestion);
router.post('/:questionId',userController.isAuth, answerController.answerTheQuestion);
router.delete('/:answerId', answerController.deleteTheAnswer)
router.patch('/:answerId/upvote', answerController.upvoteAnswer);
router.patch('/:answerId/downvote', answerController.downvoteAnswer);

module.exports = router
