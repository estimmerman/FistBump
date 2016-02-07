exports.sortPostsByRating = function(posts) {
	function comparePosts(a,b) {
	  if (a.ratings.main < b.ratings.main)
	    return 1;
	  else if (a.ratings.main > b.ratings.main)
	    return -1;
	  else 
	    return 0;
	}

	return posts.sort(comparePosts);
}