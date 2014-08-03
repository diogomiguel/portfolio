/**
 * Module video
 *
 * @author Diogo Silva
 * @date 2014-5-19
 */
// Set default


define(['jquery', 'modules/ourwork', 'modules/nav', 'modules/scrolling', 'modules/rocks', 'modules/video', 'simpleStateManager'], function ($, ourwork, nav, scrolling, rocks, video, ssm) {

	// Strict mode to prevent sloppy JS
	'use strict';

	var documentHeight = 0,
		$doc = $(document),
		initScrolling = false;

	// Public API
	return {
		
		init: function() {
			documentHeight = $doc.height();

			var that = this,
				checkNavSections = function() {
					
					
					if (documentHeight !== $doc.height()) {
					
						// Set new break points for navigation when height of document changes
						nav.setSectionPositions();

						documentHeight = $doc.height();
					}
				},
				touchOnEnter = function() {
					video.setMobileVideoDimensions();
			        setTimeout(function(){
						ourwork.rearrangeGrid(1000);
						checkNavSections();
					}, 500);
					ourwork.playVideos();

					// Destroy scrolling on enter
					scrolling.destroy();

					
				},
				touchOnResize = function() {
					
					// On resize set new height for the main video
					video.setMobileVideoDimensions();

					// On resize re-arrange the our works grid
					setTimeout(function(){
						ourwork.rearrangeGrid(1000);
						checkNavSections();
					}, 500);

					
				},
				desktopOnEnter = function() {

					// If not initialized init scrolling here
					if (!initScrolling) {
						rocks.init();
						scrolling.init();
						initScrolling = true;
						console.log("Init Scrolling and Rocks");
					}

					ourwork.playVideos();

					
				},
				desktopOnResize = function() {
					// Every resize refreshes the parallax
					that.refreshParallax();
				};


			// Add SSM config for touch devices
			ssm.addConfigOption({name:"isTouch", test: function(){

				return this.state.isTouch === window.isTouchDevice();
			}});

			

			// Mobile Devices
			ssm.addState({
			    id: 'mobile',
			    maxWidth: 767,
			    onEnter: function() {
					window.currentMQ = 'XS';
					touchOnEnter();
					console.log('enter mobile');
			    },
			    onResize: function() {
					touchOnResize();
			    }
			});

			// Tablets
			ssm.addState({
			    id: 'tabletS',
			    minWidth: 768,
			    maxWidth: 961,
			    onEnter: function() {
					window.currentMQ = 'S';
					touchOnEnter();
					console.log('enter S - tablet');
			    },
			    onResize: function() {
					touchOnResize();
			    }
			});
			// Tablets - when touch device is detected it never goes to desktop design - not even on Landscape
			ssm.addState({
			    id: 'tabletSTouch',
			    minWidth: 961,
			    maxWidth: 1024,
			    isTouch: true,
			    onEnter: function() {
					window.currentMQ = 'S';
					touchOnEnter();
					console.log('enter Landscape Tablet Touch');
			    },
			    onResize: function() {
					touchOnResize();
			    }
			});



			// Small Desktop
			ssm.addState({
			    id: 'desktopM',
				minWidth: 961,
			    maxWidth: 1132,
			    isTouch: false,
			    onEnter: function(){
					window.currentMQ = 'M';

					setTimeout(function(){
						ourwork.rearrangeGrid(236);

						// Every resize refreshes the parallax
						that.refreshParallax();

						// Re-check navigation
						checkNavSections();
					}, 500);

					// Scrolling is destroyed for onTouch. When moving to desktop reinstante
					scrolling.reinstate();
					// Video is restored to what it should be
					video.setDesktopVideoDimensions();

					desktopOnEnter();
					
					console.log('enter M - desktop');
			    },
				onResize: function(){
					desktopOnResize();
				}
			});

			// Big Desktop
			ssm.addState({
			    id: 'desktopL',
			    minWidth: 1133,
			    isTouch: false,
			    onEnter: function(){
					window.currentMQ = 'L';
					setTimeout(function(){
						ourwork.rearrangeGrid(282);

						// Every resize refreshes the parallax
						that.refreshParallax();

						// Re-check navigation
						checkNavSections();
					}, 500);
					
					desktopOnEnter();

					console.log('enter L - desktop');
			    },
				onResize: function(){
					desktopOnResize();
				}
			});

			ssm.ready();


			
		},

		refreshParallax: function() {
			rocks.refresh();
			scrolling.refresh();

			console.log('Refresh Parallaxing');
		}
	};

});