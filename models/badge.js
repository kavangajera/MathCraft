const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const badgeSchema = new Schema({
    position: { type: String },
    description: { type: String },
})

const Badge = mongoose.model("Badge", badgeSchema)

module.exports = Badge