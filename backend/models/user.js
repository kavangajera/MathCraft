const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    badgeId: { type: mongoose.Types.ObjectId, required: true, ref: 'Badge'},
    profile_photo: { type: String },
})

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema)
module.exports = User