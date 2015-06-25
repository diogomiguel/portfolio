/**
 * Module video
 *
 * @author Diogo Silva
 * @date 2014-5-19
 */

// Set default

define(['jquery', 'modules/grid', 'simpleStateManager'], function($, grid, ssm) {

    // Strict mode to prevent sloppy JS
    'use strict';

    var documentHeight = 0,
        $doc = $(document);

    // Public API
    return {
        
        init: function() {

            documentHeight = $doc.height();

            // Add SSM config for touch devices
            ssm.addConfigOption({name:"isTouch", test: function() {

                return this.state.isTouch === window.isTouchDevice();
            }});

            // Mobile Devices
            ssm.addState({
                id: 'XS',
                maxWidth: 480,
                onEnter: function() {
                    
                    // transform grid
                    grid.setMasonry(1);

                    // no filtering for mobile
                    grid.resetMasonryFilter();

                    console.log('enter XS - mobile');
                }
            });

            // Tablets Portrait
            ssm.addState({
                id: 'S',
                minWidth: 481,
                maxWidth: 768,
                onEnter: function() {
                    
                    // transform grid
                    grid.setMasonry(2);

                    console.log('enter S - tablet');
                }
            });

            // Tablets Landscape
            ssm.addState({
                id: 'M',
                minWidth: 769,
                maxWidth: 960,
                onEnter: function() {
                    
                    // transform grid
                    grid.setMasonry(3);

                    console.log('enter M - tablet landscape');
                }
            });

            // Desktop
            ssm.addState({
                id: 'L',
                minWidth: 961,
                maxWidth: 1600,
                onEnter: function() {
                    
                    // transform grid
                    grid.setMasonry(4);

                    console.log('enter L - desktop');
                }
            });

            // Desktop Large
            ssm.addState({
                id: 'XL',
                minWidth: 1601,
                onEnter: function() {
                    
                    // transform grid
                    grid.setMasonry(5);

                    console.log('enter XL - desktop');
                }
            });

            ssm.ready();

        }
    };

});
