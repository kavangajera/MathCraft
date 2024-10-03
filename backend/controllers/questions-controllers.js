const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Question = require("../models/question");

const getQuestions = async (req, res, next) => {
  let questions;
  try {
    questions = await Question.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching questions failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    questions: questions.map((question) =>
      question.toObject({ getters: true })
    ),
  });
};

const getUserQuestions = async (req, res, next) => {
  const username = req.params.username;
  console.log(username);

  let questions;

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      res.json({ error: "User does not exist" });
      return;
    }

    questions = await Question.find({ userId: user._id });
  } catch (err) {
    const error = new HttpError(
      "Fetching user's questions failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    questions: questions.map((question) =>
      question.toObject({ getters: true })
    ),
  });
};

// const deleteQuestions = async (req, res, next) => {}

const createUserQuestion = async (req, res, next) => {
  const { question } = req.body;
  const username = req.params.username;

  const user = await User.findOne({ username: username });
  if (!user) {
    res.json({ error: "User does not exist" });
  }

  const createdQuestion = new Question({
    userId: user._id,
    question,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  try {
    await createdQuestion.save();
  } catch (err) {
    const error = new HttpError("Creating question failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ question: createdQuestion.toObject({ getters: true }) });
};

exports.getQuestions = getQuestions;
exports.getUserQuestions = getUserQuestions;
exports.createUserQuestion = createUserQuestion;
