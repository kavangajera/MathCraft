const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Question = require("../models/question");

const getQuestions = async (req, res, next) => {
  let questions;
  try {
    // Populate the userId field with the username from the User model
    questions = await Question.find().populate('userId', 'username'); 
  } catch (err) {
    const error = new HttpError(
      "Fetching questions failed, please try again later.",
      500
    );
    return next(error);
  }

  // Map through the questions and convert to plain objects
  res.json({
    questions: questions.map((question) => 
      question.toObject({ getters: true })
    ).map(q => ({
      ...q, // Spread the original question properties
      userId: q.userId.username // Replace userId with the actual username
    })),
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

const createUserQuestion = async (req, res, next) => {
  const { question, category } = req.body;
  const username = req.params.username;

  if(category==="Error"){
    return res.status(404).json({ error: "Enter valid Mathematics Question!!!" });
  }

  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(404).json({ error: "User does not exist" });
  }

  if (!question || !category) {
    return res.status(400).json({ error: "Question and category are required" });
  }

  const createdQuestion = new Question({
    userId: user._id,
    question,
    category,
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

const getQuestionById = async (req, res) => {
  const questionId = req.params.id;

  try {
    // Find the question by ID
    const question = await Question.findById(questionId).populate('answers').populate('userId', 'username');

    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    const questionObj = question.toObject({ getters: true });
    questionObj.userId = questionObj.userId.username;

    res.json({ 
      question: questionObj, 
      answers: question.answers 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching question.' });
  }
};

exports.getQuestionById = getQuestionById;
exports.getQuestions = getQuestions;
exports.getUserQuestions = getUserQuestions;
exports.createUserQuestion = createUserQuestion;