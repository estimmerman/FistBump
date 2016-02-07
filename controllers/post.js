var _ = require('lodash');
var async = require('async');
var passport = require('passport');
var User = require('../models/User');
var Post = require('../models/Post');
var Rating = require('../models/Rating');
var helpers = require('../helpers/helpers');

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
      location: req.user.location,
      createdAt: new Date()
    });

	post.save(function(err) {
		post = JSON.parse(JSON.stringify(post));
		if (post.category === 'bro') {
			var subVotes = 0;
			Object.keys(post.ratings.bro).forEach(function(key) {
			  subVotes += post.ratings.bro[key];
			});
			post.ratingPercentages = {};
			Object.keys(post.ratings.bro).forEach(function(key) {
			  post.ratingPercentages[key] = subVotes == 0 ? 0 : Math.round((post.ratings.bro[key] / subVotes) * 100);
			});
		} else {
			var subVotes = 0;
			Object.keys(post.ratings.bruh).forEach(function(key) {
			  subVotes += post.ratings.bruh[key];
			});
			post.ratingPercentages = {};
			Object.keys(post.ratings.bruh).forEach(function(key) {
			  post.ratingPercentages[key] = subVotes == 0 ? 0 : Math.round((post.ratings.bruh[key] / subVotes) * 100);
			});
		}

		var response = {};
			if (err) {
			response = {
			  code: 500,
			  msg: 'Issue creating post.'
			}
		} else {
			response = {
			  code: 200,
			  msg: 'Post created.',
			  post: post
			}
		}
		return res.send(response);
    })
};

exports.getAllPosts = function(req, res, next) {
	var sortQuery = req.query.sort ? req.query.sort : '';

	if (sortQuery && sortQuery == 'date') {
		var category = req.params.category;
		Post.find({ category: category })
		.populate('user')
		.sort( { createdAt: -1 })
		.exec(function(err, posts) {
			if (err) {
				req.flash('errors', { msg: 'Can\'t retrieve posts.' });
				return res.redirect('/');
			}

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
					  post.ratingPercentages[key] = subVotes == 0 ? 0 : Math.round((post.ratings.bro[key] / subVotes) * 100);
					});
				} else {
					var subVotes = 0;
					Object.keys(post.ratings.bruh).forEach(function(key) {
					  subVotes += post.ratings.bruh[key];
					});
					post.ratingPercentages = {};
					Object.keys(post.ratings.bruh).forEach(function(key) {
					  post.ratingPercentages[key] = subVotes == 0 ? 0 : Math.round((post.ratings.bruh[key] / subVotes) * 100);
					});
				}
			}

			Rating.find({ user: req.user.id })
			.populate('user')
			.populate('post')
			.exec(function(error, userRatings) {
				if (error) {
					req.flash('errors', { msg: 'Can\'t retrieve posts.' });
					return res.redirect('/');
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
					  posts: posts,
					  userRatings: userRatings
					}
				}
				return res.send(response);
			});
		});
	} else {
		var category = req.params.category;
		Post.find({ category: category })
		.populate('user')
		.exec(function(err, posts) {
			if (err) {
				req.flash('errors', { msg: 'Can\'t retrieve posts.' });
				return res.redirect('/');
			}

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
					  post.ratingPercentages[key] = subVotes == 0 ? 0 : Math.round((post.ratings.bro[key] / subVotes) * 100);
					});
				} else {
					var subVotes = 0;
					Object.keys(post.ratings.bruh).forEach(function(key) {
					  subVotes += post.ratings.bruh[key];
					});
					post.ratingPercentages = {};
					Object.keys(post.ratings.bruh).forEach(function(key) {
					  post.ratingPercentages[key] = subVotes == 0 ? 0 : Math.round((post.ratings.bruh[key] / subVotes) * 100);
					});
				}
			}

			posts = helpers.sortPostsByRating(posts);			

			Rating.find({ user: req.user.id })
			.populate('user')
			.populate('post')
			.exec(function(error, userRatings) {
				if (error) {
					req.flash('errors', { msg: 'Can\'t retrieve posts.' });
					return res.redirect('/');
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
					  posts: posts,
					  userRatings: userRatings
					}
				}
				return res.send(response);
			});
		});
	}
};

exports.postRateMain = function(req, res, next) {
	var postId = req.body.postId;
	if (!postId) {
		req.flash('errors', { msg: 'Can\'t find post.' });
		return res.redirect('/');
	}

	Rating.findOne({ post: postId, user: req.user.id })
	.exec(function(err, rating){
		if (err) {
			req.flash('errors', { msg: 'Can\'t find post.' });
			return res.redirect('/');
		}

		// if rating exists for this user and post, then remove that rating
		if (rating) {
			Post.findById(postId, function(err, post) {
				if (err) {
					req.flash('errors', { msg: 'Can\'t find post.' });
					return res.redirect('/');
				}

				var ratingSettings = rating.ratings;
				var hadUpvoted = ratingSettings.main;


				ratingSettings.main = !ratingSettings.main;
				rating.ratings = ratingSettings;
			    rating.markModified('ratings');
				rating.save(function(err){
					if (err) {
						req.flash('errors', { msg: 'Can\'t find post.' });
						return res.redirect('/');
					}

					var ratings = post.ratings;
					// remove the upvote
					if (hadUpvoted) {
						ratings.main -= 1;
					} else {
						ratings.main += 1;
					}
				    post.ratings = ratings;
				    post.markModified('ratings');
				    post.save(function(err) {
						if (err) {
							req.flash('errors', { msg: 'Can\'t find post to adjust rating.' });
							return res.redirect('/');
						}

						var response = {};
						response = {
						  code: 200,
						  msg: 'Post and rating updated.',
						  updatedPost: post
						}
						return res.send(response);
				    });				
				});
			});	
		} else {
			Post.findById(postId, function(err, post) {
				if (err) {
					req.flash('errors', { msg: 'Can\'t find post.' });
					return res.redirect('/');
				}

				var rating = new Rating({
			      user: req.user._id,
			      post: postId,
			      ratings: { 
				    'main': true,
				    'subRating': { 'name': '', 'active': false }
				  }
			    });

			    rating.save(function(err){
			    	if (err) {
			    		if (post.category === 'bro') {
							req.flash('errors', { msg: 'Can\'t fistbump :(' });
			    		} else {
							req.flash('errors', { msg: 'Can\'t bro hug :(' });
			    		}
						return res.redirect('/');
					}

					var ratings = post.ratings;
					// remove the upvote
					ratings.main = ratings.main += 1;
				    post.ratings = ratings;
				    post.markModified('ratings');
				    post.save(function(err) {
						if (err) {
							req.flash('errors', { msg: 'Can\'t find post.' });
							return res.redirect('/');
						}

						var response = {};
						response = {
						  code: 200,
						  msg: 'Post and rating updated.',
						  updatedPost: post
						}
						return res.send(response);
					});
			    });
			});
		}
	});
};

exports.postRateSubCategory = function(req, res, next) {
	var postId = req.body.postId;
	if (!postId) {
		req.flash('errors', { msg: 'Can\'t find post.' });
		return res.redirect('/');
	}

	var category = req.params.category;
	if (!category) {
		req.flash('errors', { msg: 'Can\'t find post.' });
		return res.redirect('/');
	}

	Rating.findOne({ post: postId, user: req.user.id })
	.exec(function(err, rating){
		if (err) {
			req.flash('errors', { msg: 'Can\'t find post.' });
			return res.redirect('/');
		}

		if (rating) {
			Post.findById(postId, function(err, post) {
				if (err) {
					req.flash('errors', { msg: 'Can\'t find post.' });
					return res.redirect('/');
				}

				var ratingSettings = rating.ratings;

				var actionData = {
					deactivate: null,
					activate: null
				};
				
				if (ratingSettings.subRating.active) {
					// clicked already activated option, deactivate it
					if (category == ratingSettings.subRating.name) {
						actionData.deactivate = category;
						ratingSettings.subRating = { 'name': '', active: false };
					// otherwise activate different option
					} else {
						actionData.deactivate = ratingSettings.subRating.name;
						actionData.activate = category;
						ratingSettings.subRating = { 'name': category, active: true };
					}
				// nothing previously activated, activate chosen option
				} else {
					actionData.activate = category;
					ratingSettings.subRating = { 'name': category, active: true };
				}

				rating.ratings = ratingSettings;
			    rating.markModified('ratings');
				rating.save(function(err){
					if (err) {
						req.flash('errors', { msg: 'Can\'t find post.' });
						return res.redirect('/');
					}

					var ratings = post.ratings;

					if (actionData.deactivate) {
						ratings[post.category][actionData.deactivate] -= 1;
					}
					if (actionData.activate) {
						ratings[post.category][actionData.activate] += 1;
					}
					
				    post.ratings = ratings;
				    post.markModified('ratings');
				    post.save(function(err) {
						if (err) {
							req.flash('errors', { msg: 'Can\'t find post to adjust rating.' });
							return res.redirect('/');
						}

						post = JSON.parse(JSON.stringify(post));
						if (post.category === 'bro') {
							var subVotes = 0;
							Object.keys(post.ratings.bro).forEach(function(key) {
							  subVotes += post.ratings.bro[key];
							});
							post.ratingPercentages = {};
							Object.keys(post.ratings.bro).forEach(function(key) {
							  post.ratingPercentages[key] = subVotes == 0 ? 0 : Math.round((post.ratings.bro[key] / subVotes) * 100);
							});
						} else {
							var subVotes = 0;
							Object.keys(post.ratings.bruh).forEach(function(key) {
							  subVotes += post.ratings.bruh[key];
							});
							post.ratingPercentages = {};
							Object.keys(post.ratings.bruh).forEach(function(key) {
							  post.ratingPercentages[key] = subVotes == 0 ? 0 : Math.round((post.ratings.bruh[key] / subVotes) * 100);
							});
						}

						var response = {};
						response = {
						  code: 200,
						  msg: 'Post and rating updated.',
						  updatedPost: post
						}
						return res.send(response);
				    });				
				});
			});	
		} else {
			Post.findById(postId, function(err, post) {
				if (err) {
					req.flash('errors', { msg: 'Can\'t find post.' });
					return res.redirect('/');
				}

				var rating = new Rating({
			      user: req.user._id,
			      post: postId,
			      ratings: { 
				    'main': false,
				    'subRating': { 'name': category, 'active': true }
				  }
			    });

			    rating.save(function(err){
			    	if (err) {
			    		if (post.category === 'bro') {
							req.flash('errors', { msg: 'Can\'t fistbump :(' });
			    		} else {
							req.flash('errors', { msg: 'Can\'t bro hug :(' });
			    		}
						return res.redirect('/');
					}

					var ratings = post.ratings;
					
					ratings[post.category][category] += 1;

				    post.ratings = ratings;
				    post.markModified('ratings');
				    post.save(function(err) {
						if (err) {
							req.flash('errors', { msg: 'Can\'t find post.' });
							return res.redirect('/');
						}

						post = JSON.parse(JSON.stringify(post));
						if (post.category === 'bro') {
							var subVotes = 0;
							Object.keys(post.ratings.bro).forEach(function(key) {
							  subVotes += post.ratings.bro[key];
							});
							post.ratingPercentages = {};
							Object.keys(post.ratings.bro).forEach(function(key) {
							  post.ratingPercentages[key] = subVotes == 0 ? 0 : Math.round((post.ratings.bro[key] / subVotes) * 100);
							});
						} else {
							var subVotes = 0;
							Object.keys(post.ratings.bruh).forEach(function(key) {
							  subVotes += post.ratings.bruh[key];
							});
							post.ratingPercentages = {};
							Object.keys(post.ratings.bruh).forEach(function(key) {
							  post.ratingPercentages[key] = subVotes == 0 ? 0 : Math.round((post.ratings.bruh[key] / subVotes) * 100);
							});
						}

						var response = {};
						response = {
						  code: 200,
						  msg: 'Post and rating updated.',
						  updatedPost: post
						}
						return res.send(response);
					});
			    });
			});
		}
	});
};
