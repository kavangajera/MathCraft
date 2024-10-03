const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const answerSchema = new Schema({
    questionId: { type: mongoose.Types.ObjectId, required: true, ref: "Question" },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    answer: { type: String, required: true},
    createdAt: { type: Date },
    updatedAt: { type: Date },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    verifiedByExpert: { type: Boolean, default: false },
})

const Answer = mongoose.model("answers", answerSchema)

module.exports = Answer