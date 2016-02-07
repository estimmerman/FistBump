$(document).ready(function() {

	var activeTab = 'Bro';
	var category = $('#category');
	var content = $('#content');
	var broTab = $('#bro-tab');
	var bruhTab = $('#bruh-tab');

	var loadingPostsSpinner = $('#loading-posts-spinner');
	var postsContent = $('#posts-content');

	broTab.on('click', function(){
		if (!broTab.hasClass('active')) {
			showSpinner();
			hidePosts();

			$.get('/post/get-all/bro')
			.done(function(result){
				populatePosts(result.data);

				hideSpinner();
				showPosts();
			});
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

			$.get('/post/get-all/bruh')
			.done(function(result){
				populatePosts(result.data);

				hideSpinner();
				showPosts();
			});
		}
		broTab.removeClass('active');
		bruhTab.addClass('active');
		activeTab = 'Bruh';
		category.val('bruh');
	});

	var addPostButton = $('#add-post-button');
	var addPostModal = $('#add-post-modal');
	var addPostModalLabel = $('#add-post-modal-label');
	var addPostContentLabel = $('#add-post-content-label');
	addPostButton.on('click', function() {
		addPostModalLabel.text('Post a ' + activeTab);
		addPostContentLabel.text('How\'s it going, ' + activeTab.toLowerCase() + "?");

		addPostModal.modal('show');
	});

	var addPostForm = $('#add-post-form');
	addPostForm.on('submit', function(e){
		e.preventDefault();
		$.post('/post/create', { category: category.val(), content: content.val().trim() })
		.done(function(result){
			content.val('');
			addPostModal.modal('hide');
		});
	})

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

	var populatePosts = function(posts) {
		postsContent.empty();

		for (var i = 0; i < posts.length; i++) {
			console.log(posts[i]);
			var post = posts[i];

			var content = null;
			if (post.category === 'bro') {
				content = getBroPostHTML(post, i);
			} else {
				content = getBruhPostHTML(post, i);
			}

			postsContent.append(content);
		}

		reinitMainRatingIcons();
	}

	var getBroPostHTML = function(post, index) {
		var content = null;
		var isEven = index % 2 == 0;
		if (isEven) {
			content = 
				'<div class="col-sm-12 no-padding-left bro-post-container">' +
					'<div class="col-sm-7 no-padding-left">';
		} else {
			content = 
				'<div class="col-sm-12 no-padding-left bro-post-container float-right">' +
					'<div class="col-sm-7 no-padding-left float-right">';
		}
		content += 
			'<div class="post bro-post">' +
				'<p>' + post.content.trim() + '</p>' +
				'<div class="col-sm-12 no-padding post-footer"><b class="post-footer-label">How to celebrate?</b>' +
					'<div class="col-sm-12 no-padding post-footer-options-list">' +
						'<div class="col-sm-3 no-padding post-footer-option-border">' +
							'<p class="post-footer-option"><img src="/assets/bottoms-up.png" height="20" class="fa"/>Bottom\'s Up<span class="bold pull-right">' + post.ratingPercentages['bottoms-up'] + '%</span></p>' +
						'</div>' +
						'<div class="col-sm-3 no-padding post-footer-option-border">' +
				            '<p class="post-footer-option"><img src="/assets/hit-the-club.png" height="20" class="fa"/>Hit the Club<span class="bold pull-right">' + post.ratingPercentages['hit-the-club'] + '%</span></p>' +
						'</div>' +
						'<div class="col-sm-3 no-padding post-footer-option-border">' +
				            '<p class="post-footer-option"><i class="fa fa-cutlery"></i>Feast<span class="bold pull-right">' + post.ratingPercentages['feast'] + '%</span></p>' +
						'</div>' +
						'<div class="col-sm-3 no-padding post-footer-option-border no-border">' +
				            '<p class="post-footer-option"><img src="/assets/kickback.png" height="20" class="fa"/>Kickback<span class="bold pull-right">' + post.ratingPercentages['kickback'] + '%</span></p>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>';

		if (isEven) {
			content += '</div>' +
				'<div class="col-sm-5 no-padding">' +
				  '<div style="margin-top: 50px; margin-left: -25px; width: inherit; text-align: center"><img src="/assets/fistbump-256.png" height="65" class="main-rating fistbump"/>' +
				    '<p>' + post.ratings['main'] + '</p>' +
				  '</div>' +
				'</div>';
		} else {
			content += '</div>' +
			'<div class="col-sm-5 no-padding">' +
			  '<div style="margin-top: 50px; margin-right: -10px; width: inherit; text-align: center; float: right"><img src="/assets/fistbump-256.png" height="65" class="main-rating fistbump"/>' +
			    '<p>' + post.ratings['main'] + '</p>' +
			  '</div>' +
			'</div>';
		}

		return content += '</div>';
	}

	var getBruhPostHTML = function(post, index) {
		var content = null;
		var isEven = index % 2 == 0;
		if (!isEven) {
			content = 
				'<div class="col-sm-12 no-padding-left bruh-post-container">' +
					'<div class="col-sm-7 no-padding-left">';
		} else {
			content = 
				'<div class="col-sm-12 no-padding-left bruh-post-container float-right">' +
					'<div class="col-sm-7 no-padding-left float-right">';
		}
		content += 
			'<div class="post bruh-post">' +
				'<p>' + post.content.trim() + '</p>' +
				'<div class="col-sm-12 no-padding post-footer"><b class="post-footer-label">The solution?</b>' +
					'<div class="col-sm-12 no-padding post-footer-options-list">' +
						'<div class="col-sm-3 no-padding post-footer-option-border">' +
				            '<p class="post-footer-option"><img src="/assets/lift-it-off.png" height="20" class="fa"/>Lift it Off<span class="bold pull-right">' + post.ratingPercentages['lift-it-off'] + '%</span></p>' +
						'</div>' +
						'<div class="col-sm-3 no-padding post-footer-option-border">' +
				            '<p class="post-footer-option"><i class="fa fa-laptop"></i>Work it Off<span class="bold pull-right">' + post.ratingPercentages['work-it-off'] + '%</span></p>' +
						'</div>' +
						'<div class="col-sm-3 no-padding post-footer-option-border">' +
				            '<p class="post-footer-option"><i class="fa fa-glass"></i>Drink it Off<span class="bold pull-right">' + post.ratingPercentages['drink-it-off'] + '%</span></p>' +
						'</div>' +
						'<div class="col-sm-3 no-padding post-footer-option-border no-border">' +
				            '<p class="post-footer-option"><i class="fa fa-hotel"></i>Sleep it Off<span class="bold pull-right">' + post.ratingPercentages['sleep-it-off'] + '%</span></p>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>';

		if (!isEven) {
			content += '</div>' +
			'<div class="col-sm-5 no-padding">' +
			  '<div style="margin-top: 50px; margin-left: -25px; width: inherit; text-align: center"><img src="/assets/bro-hug-256.png" height="65" class="main-rating bro-hug"/>' +
				'<p>' + post.ratings['main'] + '</p>' +
			  '</div>' +
			'</div>';
		} else {
			content += '</div>' +
			'<div class="col-sm-5 no-padding">' +
				'<div style="margin-top: 50px; margin-left: -10px; width: inherit; text-align: center; float: right;"><img src="/assets/bro-hug-256.png" height="65" class="main-rating bro-hug"/>' +
					'<p>' + post.ratings['main'] + '</p>' +
				'</div>' +
			'</div>';
		}

		return content += '</div>';
	}

	var reinitMainRatingIcons = function() {
		$('.fistbump').hover( function(){
		  $(this).attr('src', '/assets/fistbump-256-metallic-blue.png');
		},
		function(){
		  $(this).attr('src', '/assets/fistbump-256.png');
		});

		$('.bro-hug').hover( function(){
		  $(this).attr('src', '/assets/bro-hug-256-blue-grey.png');
		},
		function(){
		  $(this).attr('src', '/assets/bro-hug-256.png');
		});
	}

	// load bro posts initially
	$.get('/post/get-all/bro')
	.done(function(result){
		populatePosts(result.data);

		hideSpinner();
		showPosts();
	});
});