const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Note = require('./note.model');

var Group = new Schema({
    name: { type: String, unique: true, required: true },
    notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
});

Group.pre('remove', function(next) {
    Note.remove({ _id: { '$in': this.notes } });
});

module.exports = mongoose.model('Group', Group);