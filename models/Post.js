var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  content: { type: String, default: '' },
  category: { type: String, default: '' },
  location: { type: Object, default: { 'latitude' : null, 'longitude' : null } },
  ratings: { type: Object, default: { 
    'main': 0,
    'bro': {'bottoms-up': 0, 'hit-the-club': 0, 'feast': 0, 'kickback': 0 }, 
    'bruh': { 'lift-it-off': 0, 'work-it-off': 0, 'drink-it-off': 0, 'sleep-it-off': 0 }
  }}
});

module.exports = mongoose.model('Post', postSchema);
