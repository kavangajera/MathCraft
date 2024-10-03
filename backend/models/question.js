const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User"},
    question: { type: String, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date }
})

questionSchema.plugin(uniqueValidator);

const Question = mongoose.model("questions", questionSchema)
module.exports = Question