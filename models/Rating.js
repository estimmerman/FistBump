var mongoose = require('mongoose');

var ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  post: { type: mongoose.Schema.ObjectId, ref: 'Post' },
  ratings: { type: Object, default: { 
    'main': false,
    'subRating': { 'name': '', 'active': false }
  }}
});

module.exports = mongoose.model('Rating', ratingSchema);
