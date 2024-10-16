const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    answerId: { type: mongoose.Types.ObjectId, ref: 'Answer'},
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
})

commentSchema.plugin(uniqueValidator);

const Comment = mongoose.model("comments", commentSchema)
module.exports = Comment