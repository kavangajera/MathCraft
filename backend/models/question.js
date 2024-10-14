const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User"},
    question: { type: String, required: true },
    category: {type:String,required:true},
    createdAt: { type: Date },
    updatedAt: { type: Date },
    answerCount: {type:Number,default:0}
})

questionSchema.plugin(uniqueValidator);

const Question = mongoose.model("questions", questionSchema)
module.exports = Question