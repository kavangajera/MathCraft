const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Question = require("../models/question");
const Answer = require("../models/answer");
const Comment = require("../models/comment");

const getComments = async (req, res, next) => {
  const answerId = req.params.answerId;
  console.log(answerId);

  try {
    // find all comments on specified answerId...
    const comments = await Comment.find({ answerId: answerId });
    // console.log(comments)

    // find answer...
    const answer = await Answer.findOne({ _id: answerId });
    console.log(answer);

    // find the question...
    const question = await Question.findOne({ _id: answer.questionId });
    console.log(question);

    const response = {
      questionId: question._id,
      answer: answer.answer,
      comments: comments.map((comment) => ({
        userId: comment.userId,
        content: comment.content,
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
  const { username, password, content } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username: username, password: password });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
    }

    // // Check if the provided password is correct
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res
    //     .status(401)
    //     .json({ message: "Authentication failed. Incorrect password." });
    // }

    // Find the answer by answerId
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found." });
    }

    // Create a new comment
    const newComment = new Comment({
      answerId: answerId,
      userId: user._id,
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
