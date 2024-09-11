const express = require('express')
const { check } = require('express-validator')

const commentController = require('../controllers/comments-controllers');
const router = express.Router()

router.get('/:answerId', commentController.getComments)
router.post('/:answerId', commentController.postComments)

module.exports = router;