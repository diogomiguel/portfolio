	/**
 * Module Description
 *
 * @author Author Name
 * @date 2013-01-01
 */

require([
	// Require the modules
	'modules/grid',
	'modules/mediaqueries',
	'modules/details'
], function (grid, mediaqueries, details) {
	'use strict';

	grid.init();
	details.init();


	mediaqueries.init();

	// back to top link
	$("#js-backtop").on("click", function(e){
		$("html, body").animate({ scrollTop: "0" });
		e.preventDefault();
	});

	
});
