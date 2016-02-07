var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.ObjectId, ref: 'User' },
  sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
  post: { type: mongoose.Schema.ObjectId, ref: 'Post' },
  message: { type: String, default: '' },
  unopened: { type: Boolean, default: true },
  createdAt: { type: Date, default: null }
});

module.exports = mongoose.model('Message', messageSchema);
