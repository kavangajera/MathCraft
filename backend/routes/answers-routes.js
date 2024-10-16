const express = require('express')
const { check } = require('express-validator')

const answerController = require('../controllers/answers-controllers');
const userController = require('../controllers/users-controllers')
const router = express.Router()

router.get('/count-votes', userController.isAuth,answerController.getAllAnswersOfUser);
router.get('/:questionId',answerController.getAllAnswersOfQuestion);
router.post('/:questionId',userController.isAuth, answerController.answerTheQuestion);
router.delete('/delete/:answerId', userController.isAuth,answerController.deleteTheAnswer)
router.patch('/:answerId/upvote',userController.isAuth,answerController.upvoteAnswer);
router.patch('/:answerId/downvote', userController.isAuth,answerController.downvoteAnswer);

module.exports = router
