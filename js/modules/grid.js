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
			$(".js__grid__item__wrapper__rollover, .js-grid-readmore").on("click", function(e){

				var $this = $(this).children('a');

				// Find grid item parent and make it active after disabling already active ones
				$grid.children('.grid__item--active').removeClass('grid__item--active');
				$this.parents('.grid__item').addClass('grid__item--active');

				// Scroll to top
				$("html, body").animate({ scrollTop: "0" });


				// Show loader
				that.showLoader();

				var dataId = $this.attr("data-id"),
					dataType = $this.attr("data-type"),
					dataOpenFunc = function() {
						// Loading screen class
						$detailsView.removeClass("detailsview--close");

						console.log("Loading: " + dataType);
						// Get data from JSON after 0.5s
						switch(dataType) {
							// Projects
							case "project":
								that.loadProject(dataId);
								break;
							// About items
							case "about":
								that.loadAbout(dataId);
								break;
							// Blog items
							case "blog":
								that.loadBlog(dataId);
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
				$grid.children('.grid__item--active').removeClass('grid__item--active');

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
			var that = this;

			// Load projects JSON
			$.getJSON("data/projects.json", function(data){
				var projectData = data[dataId];

				// Remove picture if exists
				$('#js-detailsview-figure').remove();


				// Replace main image
				if (projectData.imagepath) {
					var $projectImg = $("<img/>").attr('src', 'dist/img/blank-big.gif'),
						$projectFigure = $("<figure/>").attr('id', 'js-detailsview-figure').addClass('detailsview__wrapper__figure');

					$projectImg.attr("src", 'dist/img/' + projectData.imagepath)
					.attr("alt", projectData.title);

					$projectFigure.append($projectImg);

					$('#js-detailsview-wrapper').prepend($projectFigure);
				}

				// Place header text
				$("#js-detailsview-header").html(projectData.title);

				// Place content description
				var $detailsviewDescription = $("#js-detailsview-description");
				$detailsviewDescription.html(projectData.description);

				// Place content technologies
				that._createDetailsList("Technologies", "detailsview__wrapper__technologies", projectData.technologies, $detailsviewDescription);

				// Place content links
				that._createLinksList(projectData.links, $detailsviewDescription);

				// Remove loading state and force open and visible
				$detailsView.addClass("detailsview--open");

				console.log(projectData);

				that.hideLoader();
			});
		},

		loadAbout: function(dataId) {
			var that = this;

			

			// Load about JSON
			$.getJSON("data/about.json", function(data){

				var aboutData = data[dataId];

				// Remove picture if exists
				$('#js-detailsview-figure').remove();

				// Place header text
				$("#js-detailsview-header").html(aboutData.title);

				// Place content description
				var $detailsviewDescription = $("#js-detailsview-description");
				$detailsviewDescription.html(aboutData.description);

				// Place content accordingly to section
				switch(dataId) {
					case 'about':
						// Workplaces list
						that._createDetailsList("Workplaces", "detailsview__wrapper__workplaces", aboutData.workplaces, $detailsviewDescription);

						// Interests list
						that._createDetailsList("Other Interests", "detailsview__wrapper__interests", aboutData.interests, $detailsviewDescription);

						// CV
						that._createLinksList(aboutData.cv, $detailsviewDescription);

						break;
					case 'contact':
						// Contacts list
						that._createDetailsList("Contact Details", "detailsview__wrapper__contacts", aboutData.contacts, $detailsviewDescription);
						break;
					case 'skills':
						// BackEnd list
						that._createDetailsList("Back End Skills", "detailsview__wrapper__backend", aboutData.backend, $detailsviewDescription);

						// FrontEnd list
						that._createDetailsList("Front End Skills", "detailsview__wrapper__frontend", aboutData.frontend, $detailsviewDescription);

						// Tools list
						that._createDetailsList("Productivity Tools", "detailsview__wrapper__tools", aboutData.tools, $detailsviewDescription);
						break;
				}
					

				// Remove loading state and force open and visible
				$detailsView.addClass("detailsview--open");

				console.log(aboutData);

				that.hideLoader();
			});
		},


		loadBlog: function(dataId) {
			var that = this;

			

			// Load blog JSON
			$.getJSON("data/blog.json", function(data){

				var blogData = data[dataId];

				// Remove picture if exists
				$('#js-detailsview-figure').remove();

				// Place header text
				$("#js-detailsview-header").html(blogData.title);

				// Place content description
				var $detailsviewDescription = $("#js-detailsview-description");
				$detailsviewDescription.html(blogData.description);

				// CV
				that._createLinksList(blogData.links, $detailsviewDescription);
					

				// Remove loading state and force open and visible
				$detailsView.addClass("detailsview--open");

				console.log(blogData);

				that.hideLoader();
			});
		},

		showLoader: function() {
			$('#js-loading-bg').addClass('loading__bg--active');
		},

		hideLoader: function() {
			$('#js-loading-bg').removeClass('loading__bg--active');
		},

		_createDetailsList: function(title, ulClass, dataObj, $parentEl) {
			$parentEl.append("<hr /><h3>" + title + "</h3>");
			var $ul = $("<ul/>").addClass(ulClass),
				$div = $("<div/>").addClass('detailsview__wrapper__fakeclearcontainer'),
				n = 0;

			for(; n < dataObj.length; n++) {
				var $li = $("<li/>")
				.html(dataObj[n]);
				$ul.append($li);
			}
			$div.append($ul);
			$parentEl.append($div);
		},

		_createLinksList: function(dataObj, $parentEl) {
			var n = 0,
				$ul = $("<ul>").addClass("detailsview__wrapper__links");

			for(; n < dataObj.length; n++) {
				var $li = $("<li/>"),
					$a = $('<a/>');

				$a.addClass("detailsview__wrapper__links__link")
				.text(dataObj[n][0])
				.attr("href", dataObj[n][1]);

				$ul.append($li);
				$li.append($a);
			}

			$parentEl.append("<hr />")
			.append($ul)
			.append("<div class='clearfix'></div>");
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