	/**
 * Module Description
 *
 * @author Author Name
 * @date 2013-01-01
 */

require([
	// Require the modules
	'modules/grid',
	'modules/mediaqueries'
], function ($grid, $mediaqueries) {
	'use strict';

	$grid.init();

	jQuery.holdReady(true);

	

	var $window = $(window);

	$window.load(function() {
		jQuery.holdReady(false);
	});

	$mediaqueries.init();

	
});
