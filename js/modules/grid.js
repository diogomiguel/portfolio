/**
 * Module grid
 *
 * @author Diogo Silva
 * @date 2014-08-04
 */
// Set default


define(['jquery', 'modules/details', 'simpleStateManager', 'isotope', 'imagesLoaded', 'lazyload'], function ($, details, ssm) {

	// Strict mode to prevent sloppy JS
	'use strict';

	var $grid,
		$gridProxy,
		gridColumns,
		gridOptions = {},
		gridImagesLoaded = false,

		setMasonry = function(newGridColumns) {
			// Has newGridColumns argument = change number of columns in the grid
			if (newGridColumns) {
				gridColumns = newGridColumns;
			}

			// Return if the images are not loaded
			if (!gridImagesLoaded) {
				return;
			}

			setTimeout(function(){
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
			}, 100);
		},

		resetMasonryFilter = function() {
			// Mobile has no filtering
			$grid.isotope({
				filter: '*',
				transitionDuration: '0s'
			});
		},

		applyFiltering = function(criterion) {
			console.log(criterion);
			
			$grid.imagesLoaded(function(){
				// Make sure lazy loading is working
				$(".js__grid__item__wrapper__figure").lazyload({
					effect : "fadeIn"
				});

				// Close details view
				$("#js-detailsview-closebtn").click();

				// Add animation capabilities for filtering
				$("#js-grid").children(".grid__item").addClass("grid__item--animation");

				$grid.isotope({
					filter: criterion,
					transitionDuration: '0.5s'
				});

				// Prevent resize bugs after filtering
				$(window).smartresize();

				// Remove all animation capabilities after
				setTimeout(function(){
					$("#js-grid").children(".grid__item").removeClass("grid__item--animation");
				}, 500);
			});
		};

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



			// Lazyload images
			$(".js__grid__item__wrapper__figure").lazyload({
				effect : "fadeIn"
			});

			// Execute isotope when images loaded
			$grid.imagesLoaded(function(){
				console.log("images loaded");

				// images loaded!
				gridImagesLoaded = true;

				// on debouced resize do a hack to get real percentage widths
				$(window).smartresize( function() {
					setMasonry();
				}).smartresize();

				
				
			});

			// Top nav filtering
			var $topNav = $('#js-topnav');

			$topNav.on("click", "a", function(e){
				var $this = $(this),
					criterion = $this.attr("data-filter");

				$topNav.find("a").removeClass("topnav__nav__item--active");
				$this.addClass("topnav__nav__item--active");
				applyFiltering(criterion);

				e.preventDefault();
			});

			// Open details view
			$(".js__grid__item__wrapper__rollover, .js-grid-readmore").on("click", function(e){
				// Mobile do not apply this behaviour
				if (!ssm.isActive("XS")) {
					
					// Find grid item parent and make it active after disabling already active ones
					$grid.children('.grid__item--active').removeClass('grid__item--active');

					// Open details view
					details.open($(this));

					// Scroll to top
					$("html, body").animate({ scrollTop: "0" });

					e.preventDefault();
				}
				
			});

			// Close details view
			$("#js-detailsview-closebtn").on("click", function(){
				// Make all grid elements active again
				$grid.children('.grid__item--active').removeClass('grid__item--active');

				// Close details view
				details.close();
			});

			
		},

		setMasonry: setMasonry,

		resetMasonryFilter: resetMasonryFilter

	};

});