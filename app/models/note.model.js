const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Note = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true }
});

module.exports = mongoose.model('Note', Note);