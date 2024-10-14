const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Answer = require("../models/answer");
const Question = require("../models/question");

// const get = async (req, res, next) => {};

// const getAllAnswersOfUser = async (req, res, next) => {
//   const username = req.params.username;

//   try {
//     const user = await User.findOne({ username: username });

//     // Find all questions asked by the specific user...
//     const userQuestions = await Question.find({ userId: user._id });

//     if (userQuestions.length === 0) {
//       return res.json({ message: "This user has not asked any questions." });
//     }
  
//     // list of questionId of userQuestions...
//     const questionIds = userQuestions.map((question) => question._id);

//     // Find all answers to those userQestions...
//     const answers = await Answer.find({
//       questionId: { $in: questionIds },
//     });

//     // Format the response
//     const response = userQuestions.map((question) => ({
//       questionId: question._id,
//       question: question.question,
//       answers: answers
//         .filter(
//           (answer) => answer.questionId.toString() === question._id.toString()
//         )
//         .map((answer) => ({
//           userId: answer.userId,
//           answer: answer.answer,
//           upvotes: answer.upvotes,
//           downvotes: answer.downvotes,
//         })),
//     }));

//     res.json(response);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Failed to retrieve answers for the user's questions.",
//     });
//   }
// };

const answerTheQuestion = async (req, res, next) => {
  const { questionId } = req.params;
  const { answer } = req.body;

  try {
    // Check if the question exists
    const question = await Question.findOne({ _id: questionId });

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Get the current userId from the middleware (set by isAuth)
    const userId = req.userData.userId;

    // Create a new answer
    const newAnswer = new Answer({
      userId: userId, // Use the authenticated user's ID
      questionId: questionId,
      answer: answer,
    });

    // Save the answer
    await newAnswer.save();

    // Increment the answerCount in the Question model
    question.answerCount += 1;
    await question.save();

    res.status(201).json({ message: "Answer submitted successfully.", answer: newAnswer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Submitting the answer failed." });
  }
};


const getAllAnswersOfQuestion = async (req, res, next) => {
  const { questionId } = req.params;

  try {
    // Check if the question exists
    const question = await Question.findById(questionId);
    
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Find all answers for the specific question
    const answers = await Answer.find({ questionId: questionId }).populate('userId', 'username');

    if (answers.length === 0) {
      return res.json({ message: "No answers found for this question." });
    }

    // Format the response
    const response = answers.map(answer => ({
      answerId: answer._id,
      answer: answer.answer,
      user: answer.userId.username,  // Include the username of the answerer
      upvotes: answer.upvotes,
      downvotes: answer.downvotes,
      createdAt: answer.createdAt,
      verifiedByExpert: answer.verifiedByExpert
    }));

    res.json({ question: question.question, answers: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetching answers failed." });
  }
};



const deleteTheAnswer = async (req, res, next) => {
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


const upvoteAnswer = async (req, res, next) => {
  const answerId = req.params.answerId;

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found." });
    }

    answer.upvotes += 1;
    await answer.save();

    res.status(200).json({ message: "Upvoted successfully.", upvotes: answer.upvotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upvoting failed." });
  }
};

const downvoteAnswer = async (req, res, next) => {
  const answerId = req.params.answerId;

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found." });
    }

    answer.downvotes += 1;
    await answer.save();

    res.status(200).json({ message: "Downvoted successfully.", downvotes: answer.downvotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Downvoting failed." });
  }
};



exports.upvoteAnswer = upvoteAnswer;
exports.downvoteAnswer = downvoteAnswer;
// exports.getAllAnswersOfUser = getAllAnswersOfUser;
exports.answerTheQuestion = answerTheQuestion;
exports.deleteTheAnswer = deleteTheAnswer;
exports.getAllAnswersOfQuestion = getAllAnswersOfQuestion
