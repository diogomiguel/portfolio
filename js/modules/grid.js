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
		gridImagesLoaded = false,
		detailsViewOpen = false,
		$detailsView;

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


			$detailsView =  $("#js-detailsview");

			// Open details view
			$(".js__grid__item__wrapper__rollover, .js-grid-readmore").on("click", "a", function(e){

				var $this = $(this);
				// Scroll to top
				$("html, body").animate({ scrollTop: "0" });

				// Prevents double loading

				var dataId = $this.attr("data-id"),
					dataType = $this.attr("data-type"),
					dataOpenFunc = function() {
						// Loading screen class
						$detailsView.removeClass("detailsview--close");
						// Get data from JSON after 0.5s
						switch(dataType) {
							// Projects
							case "project":
								that.loadProject(dataId);
								break;
						}
						detailsViewOpen = true;
					};

				// If already open
				if (detailsViewOpen) {
					// If already open remove open class
					$detailsView.addClass("detailsview--close");

					setTimeout(function(){
						dataOpenFunc();
					}, 700);
				} else {
					dataOpenFunc();
				}
					

				e.preventDefault();
			});

			// Close details view
			$("#js-detailsview-closebtn").on("click", function(){
				
				$detailsView.addClass("detailsview--close");
				
				// Remove the other classes after animation finishes
				setTimeout(function(){
					$detailsView.removeClass("detailsview--open");
				}, 1200);
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

		loadProject: function(dataId) {
			// Load projects JSON
			$.getJSON("data/projects.json", function(data){
				var projectData = data[dataId];


				// Replace main image
				if (projectData.imagepath) {
					var $projectImg = $("#js-detailsview-figure img");

					$projectImg.attr("src", 'dist/img/' + projectData.imagepath)
					.attr("alt", projectData.title);
				}

				// Place header text
				$("#js-detailsview-header").html(projectData.title);

				// Place content description
				var $detailsviewDescription = $("#js-detailsview-description");
				$detailsviewDescription.html(projectData.description);

				// Place content technologies
				var n = 0,
					$ul = $("<ul>").addClass("detailsview__wrapper__technologies");

				$detailsviewDescription.append("<hr /><h3>Technologies</h3>");
				

				for(; n < projectData.technologies.length; n++) {
					var $li = $("<li/>")
						.text(projectData.technologies[n]);
					$ul.append($li);
				}

				$detailsviewDescription.append($ul)
				.append("<div class='clearfix'></div>");


				// Place content links
				n = 0;
				$ul = $("<ul>").addClass("detailsview__wrapper__links");

				for(; n < projectData.links.length; n++) {
					var $li2 = $("<li/>"),
						$a = $('<a/>');

					$a.addClass("detailsview__wrapper__links__link")
					.text(projectData.links[n][0])
					.attr("href", projectData.links[n][1]);

					$ul.append($li2);
					$li2.append($a);
				}
				$detailsviewDescription.append("<hr />")
				.append($ul)
				.append("<div class='clearfix'></div>");

				// Remove loading state and force open and visible
				$detailsView.addClass("detailsview--open");

				console.log(projectData);
			});
		},

		_applyFiltering: function(criterion) {
			console.log(criterion);
			
			$grid.imagesLoaded(function(){
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
		}


	};

});