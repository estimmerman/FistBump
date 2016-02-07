$(document).ready(function() {

	var activeTab = 'Bro';
	var category = $('#category');
	var content = $('#content');
	var broTab = $('#bro-tab');
	var bruhTab = $('#bruh-tab');

	var activeSort = 'rating';

	var loadingPostsSpinner = $('#loading-posts-spinner');
	var postsContent = $('#posts-content');

	var sortDateButton = $('#sort-date-button');
	var sortRatingButton = $('#sort-rating-button');

	var getPosts = function(category) {
		$.get('/post/get-all/' + category + '?sort=' + activeSort)
		.done(function(result){
			populatePosts(result.posts, result.userRatings);

			hideSpinner();
			showPosts();
		});
	}

	var addPostButton = $('#add-post-button');
	var addPostModal = $('#add-post-modal');
	var addPostModalLabel = $('#add-post-modal-label');
	var addPostContentLabel = $('#add-post-content-label');

	var addPostForm = $('#add-post-form');

	var hideSpinner = function() {
		loadingPostsSpinner.addClass('hidden');
	}

	var showSpinner = function() {
		loadingPostsSpinner.removeClass('hidden');
	}

	var hidePosts = function() {
		postsContent.addClass('hidden');
	}

	var showPosts = function() {
		postsContent.removeClass('hidden');
	}

	var populatePosts = function(posts, userRatings) {
		postsContent.empty();

		for (var i = 0; i < posts.length; i++) {
			var post = posts[i];

			var content = null;
			if (post.category === 'bro') {
				content = getBroPostHTML(post, i);
			} else {
				content = getBruhPostHTML(post, i);
			}

			postsContent.append(content);
		}

		initRatings(userRatings);

		reinitMainRatingIcons();
	}

	var addSinglePost = function(post) {
		var posts = postsContent.find('.post');
		var numPosts = posts.length;
		var topPost = posts[0];
		var indexData = {
			topPos: 'left',
			numPosts: numPosts
		}

		if (post.category == 'bruh') {
			indexData.topPos = 'right';
		}

		if ($(topPost).parent().hasClass('float-right')) {
			indexData.topPos = 'right';
		} else if ($(topPost).parent().length > 0){
			indexData.topPos = 'left';
		}

		// defaults to 0
		var index = 0;
		if (indexData.numPosts != 0) {
			// evens = left, odds = right
			if (post.category == 'bro') {
				// date sorting
				if (activeSort == 'date') {
					// top post is on left, so prepend to right
					if (indexData.topPos == 'left') {
						index = 1;
					}
				// rating sorting
				} else {
					if (indexData.topPos == 'right' && indexData.numPosts % 2 == 0) {
						index = 1;
					} else if (indexData.topPos == 'left' && indexData.numPosts % 2 != 0) {
						index = 1;
					}
				}
			// evens = right, odds = left
			// for bruh side
			} else {
				// date sorting
				if (activeSort == 'date') {
					// top is on right, so prepend to left
					if (indexData.topPos == 'right') {
						index = 1;
					}
				// rating sorting
				} else {
					if (indexData.topPos == 'right' && indexData.numPosts % 2 != 0) {
						index = 1;
					} else if (indexData.topPos == 'left' && indexData.numPosts % 2 == 0) {
						index = 1;
					}
				}
			}
		}

		var content = null;
		if (post.category === 'bro') {
			content = getBroPostHTML(post, index);
		} else {
			content = getBruhPostHTML(post, index);
		}

		if (activeSort == 'rating') {
			postsContent.append(content);
		// if sorting by date, put new one at top
		} else {
			postsContent.prepend(content);
		}

		initializeListenersForSinglePost($('#' + post._id));
	}

	var initRatings = function(ratings) {
		for (var i = 0; i < ratings.length; i++) {
			var rating = ratings[i];
			var possiblePost = $('#' + rating.post._id.toString());
			if (possiblePost.length > 0) {
				// active sub categories
				if (rating.ratings.subRating.active) {
					var activeChoice = possiblePost.find("[data-category='" + rating.ratings.subRating.name + "']");
					if (activeChoice.length > 0) {
						activeChoice.parent().addClass('post-footer-option-border-active');
					}
				}

				// active main icons
				if (rating.ratings.main) {
					var activeIcon = possiblePost.find("[data-img='" + rating.post._id.toString() + "']");
					if (activeIcon.length > 0) {
						if (rating.post.category == 'bro') {
							activeIcon.attr('src', '/assets/fistbump-256-metallic-blue.png');
						} else {
							activeIcon.attr('src', '/assets/bro-hug-256-blue-grey.png');
						}
					}
				}
			}
		}
	}

	var monthNames = [
	  "Jan", "Feb", "Mar",
	  "Apr", "May", "Jun", "Jul",
	  "Aug", "Sep", "Oct",
	  "Nov", "Dec"
	];

	var getMonthFromNumber = function(index) {
		return monthNames[index];
	}

	var getFormattedDate = function(date) {
		var date = new Date(date);
		var hours = date.getHours();
		var period = hours > 11 ? 'pm' : 'am';
		// 23:00 -> 11 pm
		if (hours > 12) {
			hours = hours % 12;
		// 0:00 am -> 12 am
		} else if (hours == 0) {
			hours = 12;
		}
		var minutes = date.getMinutes();
		minutes = ("0" + minutes).slice(-2);
		var day = date.getDate();
		var month = getMonthFromNumber(date.getMonth());
		var year = date.getFullYear();

		return hours + ':' + minutes + period + ' ' + month + ' ' + day + ', ' + year; 
	}

	var getBroPostHTML = function(post, index) {
		var timeStamp = getFormattedDate(post.createdAt);

		var content = null;
		var isEven = index % 2 == 0;
		if (isEven) {
			content = 
				'<div class="col-sm-12 no-padding-left bro-post-container" id="' + post._id + '">' +
					'<div class="col-sm-7 no-padding-left">';
		} else {
			content = 
				'<div class="col-sm-12 no-padding-left bro-post-container float-right" id="' + post._id + '">' +
					'<div class="col-sm-7 no-padding-left float-right">';
		}
		content += 
			'<div class="post bro-post">' +
				'<p class="post-content">' + post.content.trim() + '</p>' +
				'<div class="col-sm-12 no-padding post-footer"><b class="post-footer-label">How to celebrate?</b>' +
					'<b class="pull-right post-timestamp">' + timeStamp + '</b>' +
					'<div class="col-sm-12 no-padding post-footer-options-list">' +
						'<div class="col-sm-3 no-padding post-footer-option-border">' +
							'<p class="post-footer-option unselectable" data-id="' + post._id + '" data-category="bottoms-up"><img src="/assets/bottoms-up.png" height="20" class="fa"/>Bottom\'s Up<span class="bold pull-right" id="' + post._id + '-' + 'bottoms-up-percentage">' + post.ratingPercentages['bottoms-up'] + '%</span></p>' +
						'</div>' +
						'<div class="col-sm-3 no-padding post-footer-option-border">' +
				            '<p class="post-footer-option unselectable" data-id="' + post._id + '" data-category="hit-the-club"><img src="/assets/hit-the-club.png" height="20" class="fa"/>Hit the Club<span class="bold pull-right" id="' + post._id + '-' + 'hit-the-club-percentage">' + post.ratingPercentages['hit-the-club'] + '%</span></p>' +
						'</div>' +
						'<div class="col-sm-3 no-padding post-footer-option-border">' +
				            '<p class="post-footer-option unselectable" data-id="' + post._id + '" data-category="feast"><i class="fa fa-cutlery"></i>Feast<span class="bold pull-right" id="' + post._id + '-' + 'feast-percentage">' + post.ratingPercentages['feast'] + '%</span></p>' +
						'</div>' +
						'<div class="col-sm-3 no-padding post-footer-option-border no-border">' +
				            '<p class="post-footer-option unselectable" data-id="' + post._id + '" data-category="kickback"><img src="/assets/kickback.png" height="20" class="fa"/>Kickback<span class="bold pull-right" id="' + post._id + '-' + 'kickback-percentage">' + post.ratingPercentages['kickback'] + '%</span></p>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>';

		if (isEven) {
			content += '</div>' +
				'<div class="col-sm-5 no-padding">' +
				  '<div style="margin-top: 50px; margin-left: -25px; width: inherit; text-align: center"><img data-img="' + post._id + '" data-id="' + post._id + '" src="/assets/fistbump-256.png" height="65" class="main-rating fistbump"/>' +
				    '<p id="' + post._id + '-rating">' + post.ratings['main'] + '</p>' +
				  '</div>' +
				'</div>';
		} else {
			content += '</div>' +
			'<div class="col-sm-5 no-padding">' +
			  '<div style="margin-top: 50px; margin-right: -10px; width: inherit; text-align: center; float: right"><img data-img="' + post._id + '" data-id="' + post._id + '" src="/assets/fistbump-256.png" height="65" class="main-rating fistbump"/>' +
			    '<p id="' + post._id + '-rating">' + post.ratings['main'] + '</p>' +
			  '</div>' +
			'</div>';
		}

		return content += '</div>';
	}

	var getBruhPostHTML = function(post, index) {
		var timeStamp = getFormattedDate(post.createdAt);

		var content = null;
		var isEven = index % 2 == 0;
		if (!isEven) {
			content = 
				'<div class="col-sm-12 no-padding-left bruh-post-container"  id="' + post._id + '">' +
					'<div class="col-sm-7 no-padding-left">';
		} else {
			content = 
				'<div class="col-sm-12 no-padding-left bruh-post-container float-right"  id="' + post._id + '">' +
					'<div class="col-sm-7 no-padding-left float-right">';
		}
		content += 
			'<div class="post bruh-post">' +
				'<p class="post-content">' + post.content.trim() + '</p>' +
				'<div class="col-sm-12 no-padding post-footer"><b class="post-footer-label">The solution?</b>' +
					'<b class="pull-right post-timestamp">' + timeStamp + '</b>' +
					'<div class="col-sm-12 no-padding post-footer-options-list">' +
						'<div class="col-sm-3 no-padding post-footer-option-border">' +
				            '<p class="post-footer-option unselectable" data-id="' + post._id + '" data-category="lift-it-off"><img src="/assets/lift-it-off.png" height="20" class="fa"/>Lift it Off<span class="bold pull-right" id="' + post._id + '-' + 'lift-it-off-percentage">' + post.ratingPercentages['lift-it-off'] + '%</span></p>' +
						'</div>' +
						'<div class="col-sm-3 no-padding post-footer-option-border">' +
				            '<p class="post-footer-option unselectable" data-id="' + post._id + '" data-category="work-it-off"><i class="fa fa-laptop"></i>Work it Off<span class="bold pull-right" id="' + post._id + '-' + 'work-it-off-percentage">' + post.ratingPercentages['work-it-off'] + '%</span></p>' +
						'</div>' +
						'<div class="col-sm-3 no-padding post-footer-option-border">' +
				            '<p class="post-footer-option unselectable" data-id="' + post._id + '" data-category="drink-it-off"><i class="fa fa-glass"></i>Drink it Off<span class="bold pull-right" id="' + post._id + '-' + 'drink-it-off-percentage">' + post.ratingPercentages['drink-it-off'] + '%</span></p>' +
						'</div>' +
						'<div class="col-sm-3 no-padding post-footer-option-border no-border">' +
				            '<p class="post-footer-option unselectable" data-id="' + post._id + '" data-category="sleep-it-off"><i class="fa fa-hotel"></i>Sleep it Off<span class="bold pull-right" id="' + post._id + '-' + 'sleep-it-off-percentage">' + post.ratingPercentages['sleep-it-off'] + '%</span></p>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>';

		if (!isEven) {
			content += '</div>' +
			'<div class="col-sm-5 no-padding">' +
			  '<div style="margin-top: 50px; margin-left: -25px; width: inherit; text-align: center"><img data-img="' + post._id + '" data-id="' + post._id + '" src="/assets/bro-hug-256.png" height="65" class="main-rating bro-hug"/>' +
				'<p id="' + post._id + '-rating">' + post.ratings['main'] + '</p>' +
			  '</div>' +
			'</div>';
		} else {
			content += '</div>' +
			'<div class="col-sm-5 no-padding">' +
				'<div style="margin-top: 50px; margin-left: -10px; width: inherit; text-align: center; float: right;"><img data-img="' + post._id + '" data-id="' + post._id + '" src="/assets/bro-hug-256.png" height="65" class="main-rating bro-hug"/>' +
					'<p id="' + post._id + '-rating">' + post.ratings['main'] + '</p>' +
				'</div>' +
			'</div>';
		}

		return content += '</div>';
	}

	var initializeListenersForSinglePost = function(post) {
		post.find('.fistbump').hover( function(){
			if ($(this).attr('src') == '/assets/fistbump-256-metallic-blue.png') {
			  $(this).attr('src', '/assets/fistbump-256.png');
			} else {
			  $(this).attr('src', '/assets/fistbump-256-metallic-blue.png');
			}
		},
		function(){
			if ($(this).attr('src') == '/assets/fistbump-256.png') {
			  $(this).attr('src', '/assets/fistbump-256-metallic-blue.png');
			} else {
			  $(this).attr('src', '/assets/fistbump-256.png');
			}
		});

		post.find('.bro-hug').hover( function(){
			if ($(this).attr('src') == '/assets/bro-hug-256-blue-grey.png') {
			  $(this).attr('src', '/assets/bro-hug-256.png');
			} else {
			  $(this).attr('src', '/assets/bro-hug-256-blue-grey.png');
			}
		},
		function(){
			if ($(this).attr('src') == '/assets/bro-hug-256.png') {
			  $(this).attr('src', '/assets/bro-hug-256-blue-grey.png');
			} else {
			  $(this).attr('src', '/assets/bro-hug-256.png');
			}
		});

		post.find('.fistbump').on('click', function(){
			var postId = $(this).data('id');
			var imgEl = $(this);
			$.post('/post/rate/main', { postId: postId })
			.done(function(result){
				if (result.updatedPost) {
					var mainRatingElement = $('#' + postId + '-rating');
					if (mainRatingElement) {
						mainRatingElement.text(result.updatedPost.ratings.main.toString());
					}

					if (imgEl.attr('src') == '/assets/fistbump-256-metallic-blue.png') {
					  imgEl.attr('src', '/assets/fistbump-256.png');
					} else {
					  imgEl.attr('src', '/assets/fistbump-256-metallic-blue.png');
					}
				}
			});
		});

		post.find('.bro-hug').on('click', function(){
			var postId = $(this).data('id');
			var imgEl = $(this);
			$.post('/post/rate/main', { postId: postId })
			.done(function(result){
				if (result.updatedPost) {
					var mainRatingElement = $('#' + postId + '-rating');
					if (mainRatingElement) {
						mainRatingElement.text(result.updatedPost.ratings.main.toString());
					}

					if (imgEl.attr('src') == '/assets/bro-hug-256.png') {
					  imgEl.attr('src', '/assets/bro-hug-256-blue-grey.png');
					} else {
					  imgEl.attr('src', '/assets/bro-hug-256.png');
					}
				}
			});
		});

		post.find('.post-footer-option').on('click', function(){
			var postId = $(this).data('id');
			var category = $(this).data('category');
			var postEl = $('#' + postId);
			var elementToActivate = $(this).parent();

			var isDeactivating = elementToActivate.hasClass('post-footer-option-border-active');

			$.post('/post/rate/sub/' + category, { postId: postId })
			.done(function(result){
				if (result.updatedPost) {
					$.each(result.updatedPost.ratingPercentages, function(key, value) {
						var dataId = postId + '-' + key + '-percentage';
						var percentageElement = $('#' + dataId);
						if (percentageElement) {
							percentageElement.text(value + '%');
						}
					});

					// deactivate options
					var postRatingOptions = postEl.find('.post-footer-option-border');
					for (var i = 0; i < postRatingOptions.length; i++) {
						$(postRatingOptions[i]).removeClass('post-footer-option-border-active');
					}

					// activate chosen options
					if (!isDeactivating) {
						elementToActivate.addClass('post-footer-option-border-active');
					} else {
						elementToActivate.removeClass('post-footer-option-border-active');
					}
				}
			});
		});
	}

	var reinitMainRatingIcons = function() {
		$('.fistbump').hover( function(){
			if ($(this).attr('src') == '/assets/fistbump-256-metallic-blue.png') {
			  $(this).attr('src', '/assets/fistbump-256.png');
			} else {
			  $(this).attr('src', '/assets/fistbump-256-metallic-blue.png');
			}
		},
		function(){
			if ($(this).attr('src') == '/assets/fistbump-256.png') {
			  $(this).attr('src', '/assets/fistbump-256-metallic-blue.png');
			} else {
			  $(this).attr('src', '/assets/fistbump-256.png');
			}
		});

		$('.bro-hug').hover( function(){
			if ($(this).attr('src') == '/assets/bro-hug-256-blue-grey.png') {
			  $(this).attr('src', '/assets/bro-hug-256.png');
			} else {
			  $(this).attr('src', '/assets/bro-hug-256-blue-grey.png');
			}
		},
		function(){
			if ($(this).attr('src') == '/assets/bro-hug-256.png') {
			  $(this).attr('src', '/assets/bro-hug-256-blue-grey.png');
			} else {
			  $(this).attr('src', '/assets/bro-hug-256.png');
			}
		});

		$('.fistbump').on('click', function(){
			var postId = $(this).data('id');
			var imgEl = $(this);
			$.post('/post/rate/main', { postId: postId })
			.done(function(result){
				if (result.updatedPost) {
					var mainRatingElement = $('#' + postId + '-rating');
					if (mainRatingElement) {
						mainRatingElement.text(result.updatedPost.ratings.main.toString());
					}

					if (imgEl.attr('src') == '/assets/fistbump-256-metallic-blue.png') {
					  imgEl.attr('src', '/assets/fistbump-256.png');
					} else {
					  imgEl.attr('src', '/assets/fistbump-256-metallic-blue.png');
					}
				}
			});
		});

		$('.bro-hug').on('click', function(){
			var postId = $(this).data('id');
			var imgEl = $(this);
			$.post('/post/rate/main', { postId: postId })
			.done(function(result){
				if (result.updatedPost) {
					var mainRatingElement = $('#' + postId + '-rating');
					if (mainRatingElement) {
						mainRatingElement.text(result.updatedPost.ratings.main.toString());
					}

					if (imgEl.attr('src') == '/assets/bro-hug-256.png') {
					  imgEl.attr('src', '/assets/bro-hug-256-blue-grey.png');
					} else {
					  imgEl.attr('src', '/assets/bro-hug-256.png');
					}
				}
			});
		});

		$('.post-footer-option').on('click', function(){
			var postId = $(this).data('id');
			var category = $(this).data('category');
			var postEl = $('#' + postId);
			var elementToActivate = $(this).parent();

			var isDeactivating = elementToActivate.hasClass('post-footer-option-border-active');

			$.post('/post/rate/sub/' + category, { postId: postId })
			.done(function(result){
				if (result.updatedPost) {
					$.each(result.updatedPost.ratingPercentages, function(key, value) {
						var dataId = postId + '-' + key + '-percentage';
						var percentageElement = $('#' + dataId);
						if (percentageElement) {
							percentageElement.text(value + '%');
						}
					});

					// deactivate options
					var postRatingOptions = postEl.find('.post-footer-option-border');
					for (var i = 0; i < postRatingOptions.length; i++) {
						$(postRatingOptions[i]).removeClass('post-footer-option-border-active');
					}

					// activate chosen options
					if (!isDeactivating) {
						elementToActivate.addClass('post-footer-option-border-active');
					} else {
						elementToActivate.removeClass('post-footer-option-border-active');
					}
				}
			});
		});
	}

	sortDateButton.on('click', function() {
		if (activeSort != 'date') {
			sortDateButton.addClass('active');
			sortRatingButton.removeClass('active');

			activeSort = 'date';

			getPosts(activeTab.toLowerCase());
		}
	});

	sortRatingButton.on('click', function() {
		if (activeSort != 'rating') {
			sortRatingButton.addClass('active');
			sortDateButton.removeClass('active');

			activeSort = 'rating';

			getPosts(activeTab.toLowerCase());
		}
	});

	broTab.on('click', function(){
		if (!broTab.hasClass('active')) {
			showSpinner();
			hidePosts();

			getPosts('bro');
		}

		broTab.addClass('active');
		bruhTab.removeClass('active');
		activeTab = 'Bro';
		category.val('bro');
	});

	bruhTab.on('click', function(){
		if (!bruhTab.hasClass('active')) {
			showSpinner();
			hidePosts();

			getPosts('bruh');
		}
		broTab.removeClass('active');
		bruhTab.addClass('active');
		activeTab = 'Bruh';
		category.val('bruh');
	});

	addPostButton.on('click', function() {
		addPostModalLabel.text('Post a ' + activeTab);
		addPostContentLabel.text('How\'s it going, ' + activeTab.toLowerCase() + "?");

		addPostModal.modal('show');
	});
	
	addPostForm.on('submit', function(e){
		e.preventDefault();
		$.post('/post/create', { category: category.val(), content: content.val().trim() })
		.done(function(result){
			content.val('');
			addPostModal.modal('hide');

			if (result.code === 200) {
				addSinglePost(result.post);				
			}
		});
	})

	// load bro posts initially
	getPosts('bro');
});