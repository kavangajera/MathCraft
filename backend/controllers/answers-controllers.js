const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Answer = require("../models/answer");
const Question = require("../models/question");
const cloudinary = require('cloudinary').v2;
const Comment = require('../models/comment')
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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const answerTheQuestion = async (req, res, next) => {
  const { questionId } = req.params;
  const { answer, image } = req.body; // Assume image is in base64 format

  try {
    // Check if the question exists
    const question = await Question.findOne({ _id: questionId });

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Get the current userId from the middleware (set by isAuth)
    const userId = req.userData.userId;

    // Prepare variables for storing image URL
    let imageUrl = null;

    // If an image is provided, upload it to Cloudinary
    if (image) {
      // Remove the prefix if it exists
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      
      // Upload the image to Cloudinary
      const cloudinaryResponse = await cloudinary.v2.uploader.upload(`data:image/png;base64,${base64Data}`, {
        // You can specify additional options here (e.g., folder, transformation, etc.)
      });

      // Get the URL from the Cloudinary response
      imageUrl = cloudinaryResponse.secure_url;
    }
    console.log(imageUrl)
    // Create a new answer
    const newAnswer = new Answer({
      userId: userId, // Use the authenticated user's ID
      questionId: questionId,
      answer: answer,
      image: imageUrl // Save the Cloudinary image URL
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

    // Format the response
    const formattedAnswers = answers.map(answer => ({
      answerId: answer._id,
      answer: answer.answer,
      user: answer.userId.username,  // Include the username of the answerer
      upvotes: answer.upvotes,
      downvotes: answer.downvotes,
      createdAt: new Date(),
      verifiedByExpert: answer.verifiedByExpert,
      image: answer.image
    }));

    // Send response with both question and answers
    res.json({
      question: {
        id: question._id,
        title: question.question,  // Assuming your question schema has a title or question field
        
        // Add other fields from the question schema if necessary
      },
      answers: formattedAnswers
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetching answers failed." });
  }
};




const deleteTheAnswer = async (req, res, next) => {
  const answerId = req.params.answerId;

  try {
   
    const deletedComments = await Comment.deleteMany({ answerId: answerId });

    
    console.log(`Deleted ${deletedComments.deletedCount} comments for answer ${answerId}`);

   
    const deletedAnswer = await Answer.deleteOne({ _id: answerId, userId: req.userData.userId });

    console.log("Deleted!")
  
    if (deletedAnswer.deletedCount === 0) {
      return res.status(404).json({ message: "Answer not found." });
    }

    
    res.status(200).json({ message: "Answer and associated comments deleted successfully." });
  } catch (err) {
    // Error handling
    console.log(err)
    const error = new HttpError(
      
      "Deleting the answer and its comments failed, please try again later.",
      500
    );
    return next(error);
  }
};



const upvoteAnswer = async (req, res, next) => {
  const answerId = req.params.answerId;
  const userId = req.userData.userId; // Assuming you have the user ID from authentication

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found." });
    }

    // Check if the user has already upvoted
    if (answer.upvotedBy.includes(userId)) {
      // User wants to remove their upvote
      answer.upvotes -= 1;
      answer.upvotedBy = answer.upvotedBy.filter(id => id.toString() !== userId.toString());
    } else {
      // User wants to upvote
      answer.upvotes += 1;
      answer.upvotedBy.push(userId);

      // Check if the user has downvoted, remove the downvote
      if (answer.downvotedBy.includes(userId)) {
        answer.downvotes -= 1;
        answer.downvotedBy = answer.downvotedBy.filter(id => id.toString() !== userId.toString());
      }
    }

    await answer.save();

    res.status(200).json({ message: "Upvote toggled successfully.", upvotes: answer.upvotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upvoting failed." });
  }
};

const downvoteAnswer = async (req, res, next) => {
  const answerId = req.params.answerId;
  const userId = req.userData.userId; // Assuming you have the user ID from authentication

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found." });
    }

    // Check if the user has already downvoted
    if (answer.downvotedBy.includes(userId)) {
      // User wants to remove their downvote
      answer.downvotes -= 1;
      answer.downvotedBy = answer.downvotedBy.filter(id => id.toString() !== userId.toString());
    } else {
      // User wants to downvote
      answer.downvotes += 1;
      answer.downvotedBy.push(userId);

      // Check if the user has upvoted, remove the upvote
      if (answer.upvotedBy.includes(userId)) {
        answer.upvotes -= 1;
        answer.upvotedBy = answer.upvotedBy.filter(id => id.toString() !== userId.toString());
      }
    }

    await answer.save();

    res.status(200).json({ message: "Downvote toggled successfully.", downvotes: answer.downvotes });
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
