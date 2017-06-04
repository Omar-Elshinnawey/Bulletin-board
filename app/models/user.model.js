const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var User = new Schema({
    nickname: { type: String, unique: true, required: true },
    token: { type: String },
    group: { type: Schema.Types.ObjectId, ref: 'Group' }
});

User.pre('save', function(next) {
    this.token = crypto.randomBytes(16).toString('hex');
    next();
});

module.exports = mongoose.model('User', User);