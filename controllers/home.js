var User = require('../models/User');
var Post = require('../models/Post');
var Rating = require('../models/Rating');
var Message = require('../models/Message');

/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
	Message.find({ recipient: req.user.id })
	.populate('user')
	.populate('post')
	.sort({ createdAt: -1 })
	.exec(function(err, messages){
		if (err) {
			return res.redirect('/home');
		}

		res.render('home', {
			title: 'Home',
			homePage: true,
			messages: messages
		});
	});
};

exports.getLandingPage = function(req, res) {
  // if a user is logged in, redirect to the homepage
	if (req.user){
		return res.redirect('/home');
	} else {
		res.render('landing_page', {
			title: 'FistBump'
		});
	}
};