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

	var $grid,
		$gridProxy,
		gridColumns,
		gridOptions = {},
		gridImagesLoaded = false;

	// Public API
	return {
		
		init: function() {
			
			// Setup module vars
			$grid = $("#js-grid");
			gridColumns = 4;
			gridOptions = {
				itemSelector: ".grid__item",
				layoutMode: "masonry",
				resizable: false,
				animationEngine: "best-available"
			};
			// fake grid to serve as proxy for dimensions 
			$gridProxy = $grid.clone().empty().css({ visibility: 'hidden' });

			// place proxy
			$grid.after($gridProxy);

			var that = this;

			// Execute isotope when images loaded
			$grid.imagesLoaded(function(){
				console.log("images loaded");

				// images loaded!
				gridImagesLoaded = true;

				// on debouced resize do a hack to get real percentage widths
				$(window).smartresize( function() {
					that.setMasonry();
				}).smartresize();

				// Now allow CSS transitions
				setTimeout(function(){
					$("#js-grid").children(".grid__item").addClass("grid__item--animation");
				}, 500);
				
			});

			// Top nav filtering
			var $topNav = $('#js-topnav');

			$topNav.on("click", "a", function(e){
				var $this = $(this),
					criterion = $this.attr("data-filter");

				$topNav.find("a").removeClass("topnav__nav__item--active");
				$this.addClass("topnav__nav__item--active");
				that._applyFiltering(criterion);

				e.preventDefault();
			});

			
		},

		setMasonry: function(newGridColumns) {
			// Has newGridColumns argument = change number of columns in the grid
			if (newGridColumns) {
				gridColumns = newGridColumns;
			}

			// Return if the images are not loaded
			if (!gridImagesLoaded) {
				return;
			}

			var colWidth = Math.floor($gridProxy.width() / gridColumns );

			//set width of container based on columnWidth
			gridOptions.masonry = {
				// if bigger than 305, do nothing
				columnWidth: colWidth
			};

			// cancel default resize event
			$grid.css({
				width: colWidth * gridColumns,
				resizable: false
			})
			.isotope(gridOptions);
		},

		_applyFiltering: function(criterion) {
			console.log(criterion);
			$grid.imagesLoaded(function(){
				$grid.isotope({
					filter: criterion,
					transitionDuration: '0.5s'
				});

				// Prevent resize bugs after filtering
				$(window).smartresize();
			});
		}


	};

});