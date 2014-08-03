/**
 * Module grid
 *
 * @author Diogo Silva
 * @date 2014-08-04
 */
// Set default


define(['jquery', 'isotope', 'imagesLoaded'], function ($) {

	// Strict mode to prevent sloppy JS
	'use strict';

	// Public API
	return {
		
		init: function() {
			
			// Get grid and create default properties
			var $grid = $("#js-grid"),
				gridColumns = 4,
				gridOptions = {
					itemSelector: ".grid__item",
					layoutMode: "masonry",
					resizable: false,
					animationEngine: "best-available"
				},
				// fake grid to serve as proxy for dimensions 
				$gridProxy = $grid.clone().empty().css({ visibility: 'hidden' });

			// place proxy
			$grid.after($gridProxy);

			// Execute isotope when images loaded
			$grid.imagesLoaded(function(){
				console.log("images loaded");

				// on debouced resize do a hack to get real percentage widths
				$(window).smartresize( function() {
					var colWidth = Math.floor($gridProxy.width() / gridColumns );

					//set width of container based on columnWidth
					gridOptions.masonry = {
						// if bigger than 305, do nothing
						columnWidth: colWidth > 305 ? 305 : colWidth
					};

					// cancel default resize event
					$grid.css({
						width: colWidth * gridColumns,
						resizable: false
					})
					.isotope(gridOptions);
				}).smartresize();
			});

			
		},


	};

});