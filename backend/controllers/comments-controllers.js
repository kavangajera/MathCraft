const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Question = require("../models/question");
const Answer = require("../models/answer");
const Comment = require("../models/comment");

const getComments = async (req, res, next) => {
  const answerId = req.params.answerId;

  try {
    // Fetch comments and populate the userId with the username from the User model
    const comments = await Comment.find({ answerId: answerId }).populate('userId', 'username');

    const answer = await Answer.findOne({ _id: answerId });
    const question = await Question.findOne({ _id: answer.questionId });

    // Prepare response with usernames
    const response = {
      questionId: question._id,
      answer: answer.answer,
      comments: comments.map((comment) => ({
        username: comment.userId.username,  // Get the username instead of userId
        content: comment.content,
        createdAt: comment.createdAt
      })),
    };

    res.json(response);
  } catch (err) {
    const error = new HttpError(
      "Fetching the comments failed, please try again later.",
      500
    );
    return next(error);
  }
};


const postComments = async (req, res, next) => {
  const { answerId } = req.params;
  const { content } = req.body;

  try {
    // Find the user by username
    const uid = req.userData.userId;
    const newComment = new Comment({
      answerId: answerId,
      userId: uid,
      content: content,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save the comment
    await newComment.save();

    res
      .status(201)
      .json({ message: "Comment added successfully.", comment: newComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Adding the comment failed." });
  }
};

exports.getComments = getComments;
exports.postComments = postComments;
