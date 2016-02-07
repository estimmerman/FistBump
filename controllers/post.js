var _ = require('lodash');
var async = require('async');
var passport = require('passport');
var User = require('../models/User');
var Post = require('../models/Post');

exports.postCreatePost = function(req, res, next) {
	req.sanitize('category').trim();
	req.sanitize('content').trim();

	req.assert('category', 'Could not find type of post.').notEmpty();
	req.assert('content', 'Could not find message.').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/');
	}

	var post = new Post({
      user: req.user._id,
      category: req.body.category,
      content: req.body.content,
      location: req.user.location
    });

	post.save(function(err) {
      var response = {};
      if (err) {
        response = {
          code: 500,
          msg: 'Issue creating post.'
        }
      } else {
        response = {
          code: 200,
          msg: 'Post created.'
        }
      }
      return res.send(response);
    })
};

exports.getAllPosts = function(req, res, next) {
	var category = req.params.category;
	Post.find({ category: category })
	.populate('user')
	.exec(function(err, posts) {
		var posts = JSON.parse(JSON.stringify(posts));
		for (var i = 0; i < posts.length; i++) {
			var post = posts[i];
			if (post.category === 'bro') {
				var subVotes = 0;
				Object.keys(post.ratings.bro).forEach(function(key) {
				  subVotes += post.ratings.bro[key];
				});
				post.ratingPercentages = {};
				Object.keys(post.ratings.bro).forEach(function(key) {
				  post.ratingPercentages[key] = subVotes == 0 ? 0 : Math.min(0, Math.round((post.ratings.bro[key] / subVotes) * 100));
				});
			} else {
				var subVotes = 0;
				Object.keys(post.ratings.bruh).forEach(function(key) {
				  subVotes += post.ratings.bruh[key];
				});
				post.ratingPercentages = {};
				Object.keys(post.ratings.bruh).forEach(function(key) {
				  post.ratingPercentages[key] = subVotes == 0 ? 0 : Math.min(0, Math.round((post.ratings.bruh[key] / subVotes) * 100));
				});
			}
		}

		var response = {};
		if (err) {
			response = {
			  code: 500,
			  msg: 'Issue getting posts.'
			}
		} else {
			response = {
			  code: 200,
			  msg: 'Posts retrieved.',
			  data: posts
			}
		}
		return res.send(response);
	});
};