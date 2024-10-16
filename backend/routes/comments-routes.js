const express = require('express')
const { check } = require('express-validator')

const commentController = require('../controllers/comments-controllers');
const userController = require('../controllers/users-controllers')
const router = express.Router()

router.get('/:answerId',userController.isAuth ,commentController.getComments)
router.post('/:answerId',userController.isAuth ,commentController.postComments)

module.exports = router;