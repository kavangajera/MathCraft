const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Answer = require("../models/answer");
const Question = require("../models/question");

// const get = async (req, res, next) => {};

const getQuestionOfUserWithAnswer = async (req, res, next) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username: username });

    // Find all questions asked by the specific user...
    const userQuestions = await Question.find({ userId: user._id });

    if (userQuestions.length === 0) {
      return res.json({ message: "This user has not asked any questions." });
    }
  
    // list of questionId of userQuestions...
    const questionIds = userQuestions.map((question) => question._id);

    // Find all answers to those userQestions...
    const answers = await Answer.find({
      questionId: { $in: questionIds },
    });

    // Format the response
    const response = userQuestions.map((question) => ({
      questionId: question._id,
      question: question.question,
      answers: answers
        .filter(
          (answer) => answer.questionId.toString() === question._id.toString()
        )
        .map((answer) => ({
          userId: answer.userId,
          answer: answer.answer,
          upvotes: answer.upvotes,
          downvotes: answer.downvotes,
        })),
    }));

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to retrieve answers for the user's questions.",
    });
  }
};

const giveAnswerTheQuestion = async (req, res, next) => {
  const { questionId } = req.params;
  const { username, answer } = req.body;

  try {
    // Check if the question exists...
    const question = await Question.findOne({ _id: questionId });

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Check if the user exists...
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create a new answer...
    const newAnswer = new Answer({
      userId: user._id,
      questionId: questionId,
      answer: answer,
    });

    // Save the answer
    await newAnswer.save();

    res
      .status(201)
      .json({ message: "Answer submitted successfully.", answer: newAnswer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Submitting the answer failed." });
  }
};

const deleteAnswerTheQuestion = async (req, res, next) => {
  const answerId= req.params.answerId;
  const { username, password } = req.body;

  try {
    // Find and delete the answer by its ID
    const user = await User.findOne({ username: username, password: password })

    if(!user){
      return res.status(404).json({ message: "User not found." });
    }

    const deletedAnswer = await Answer.deleteOne({_id: answerId, userId: user._id});
    
    if (deletedAnswer.deletedCount === 0) {
      return res.status(404).json({ message: "Answer not found." });
    }

    res.status(200).json({ message: "Answer deleted successfully." });
  } catch (err) {
    const error = new HttpError(
      "Deleting the answer failed, please try again later.",
      500
    );
    return next(error);
  }
};

exports.getQuestionOfUserWithAnswer = getQuestionOfUserWithAnswer;
exports.giveAnswerTheQuestion = giveAnswerTheQuestion;
exports.deleteAnswerTheQuestion = deleteAnswerTheQuestion;
