/**
 * Module details
 *
 * @author Diogo Silva
 * @date 2014-08-04
 */

// Set default

define(['jquery'], function($) {

    // Strict mode to prevent sloppy JS
    'use strict';

    var detailsViewOpen = false,
    $detailsView,
    $loadingBG,
    projectsJson = "data/projects.json",
    aboutJson = "data/about.json",
    blogJson = "data/blog.json",

    open = function($target) {
        var $this = $target.children('a');

        // Find grid item parent and make it active after disabling already active ones
        $this.parents('.grid__item').addClass('grid__item--active');

        // Show loader
        this.showLoader();

        var dataId = $this.attr("data-id"),
        dataType = $this.attr("data-type"),
            dataOpenFunc = function() {
                // Loading screen class
                $detailsView.removeClass("detailsview--close");

                console.log("Loading: " + dataType);

                // Get data from JSON after 0.5s
                switch (dataType) {
                // Projects
                    case "project":
                        loadProject(dataId);
                        break;

                        // About items
                    case "about":
                        loadAbout(dataId);
                        break;

                        // Blog items
                    case "blog":
                        loadBlog(dataId);
                        break;
                }
                detailsViewOpen = true;
            };

        // If already open
        if (detailsViewOpen) {
            // If already open remove open class
            $detailsView.addClass("detailsview--close");

            setTimeout(function() {
        dataOpenFunc();
    }, 700);
        } else {
            dataOpenFunc();
        }
    },

    close = function() {
        $detailsView.addClass("detailsview--close");
        
        // Remove the other classes after animation finishes
        setTimeout(function() {
            $detailsView.removeClass("detailsview--open");
        }, 1200);
    },

    showLoader = function() {
        $loadingBG.addClass('loading__bg--active');
    },

    hideLoader = function() {
        $loadingBG.removeClass('loading__bg--active');
    },

    loadProject = function(dataId) {
        // Load projects JSON
        $.getJSON(projectsJson)
        .done(function(data) {
            var projectData = data[dataId];

            // Place header text
            $("#js-detailsview-header").html(projectData.title);

            // Place content description
            var $detailsviewDescription = $("#js-detailsview-description");
                        
            // Clean previous content
            $detailsviewDescription.html("");

            // Replace main image
            if (projectData.imagepath) {
                var $projectImg = $("<img/>").attr('src', 'dist/img/blank-big.gif'),
                $projectFigure = $("<figure/>").attr('id', 'js-detailsview-figure').addClass('detailsview__wrapper__figure');

                $projectImg.attr("src", 'dist/img/' + projectData.imagepath)
                .attr("alt", projectData.title);

                // Insert image in link
                var $projectLink = $("<a/>");

                $projectLink.html($projectImg);

                if (projectData.links && projectData.links.length) {
                    $projectLink.attr("href", projectData.links[0][1])
                    .attr("target", "_blank");
                }

                $projectFigure.append($projectLink);

                $detailsviewDescription.append($projectFigure);
            }

            $detailsviewDescription.append(projectData.description);
                    
            $detailsviewDescription.append("<div class='clearfix'></div>");

            // Place content technologies
            createDetailsList("Technologies", "detailsview__wrapper__technologies", projectData.technologies, $detailsviewDescription);

            // Place content links
            createLinksList(projectData.links, $detailsviewDescription);

            // Remove loading state and projectData.links open and visible
            $detailsView.addClass("detailsview--open");

            
        })
        .fail(function() {
            console.log('Problem loading the JSON');
        })
        .always(function() {
            hideLoader();
        });
    },

    loadAbout = function(dataId) {

        // Load about JSON
        $.getJSON(aboutJson)
        .done(function(data) {

            var aboutData = data[dataId];

            // Remove picture if exists
            $('#js-detailsview-figure').remove();

            // Place header text
            $("#js-detailsview-header").html(aboutData.title);

            // Place content description
            var $detailsviewDescription = $("#js-detailsview-description");
            $detailsviewDescription.html(aboutData.description);

            // Place content accordingly to section
            switch (dataId) {
                case 'about':

                    // Workplaces list
                    createDetailsList("Workplaces", "detailsview__wrapper__workplaces", aboutData.workplaces, $detailsviewDescription);

                    // Interests list
                    createDetailsList("Other Interests", "detailsview__wrapper__interests", aboutData.interests, $detailsviewDescription);

                    // CV
                    createLinksList(aboutData.cv, $detailsviewDescription);

                    break;
                case 'contact':

                    // Contacts list
                    createDetailsList("Contact Details", "detailsview__wrapper__contacts", aboutData.contacts, $detailsviewDescription);
                    break;
                case 'skills':
                    
                    // FrontEnd list
                    createDetailsList("Front End Skills", "detailsview__wrapper__frontend", aboutData.frontend, $detailsviewDescription);

                    // BackEnd list
                    createDetailsList("Back End Skills", "detailsview__wrapper__backend", aboutData.backend, $detailsviewDescription);

                    // Tools list
                    createDetailsList("Tools and Miscs", "detailsview__wrapper__tools", aboutData.tools, $detailsviewDescription);
                    break;
            }
                
            // Remove loading state and force open and visible
            $detailsView.addClass("detailsview--open");
            
        })
        .fail(function() {
            console.log('Problem loading the JSON');
        })
        .always(function() {
            hideLoader();
        });
    },

    loadBlog = function(dataId) {
        
        // Load blog JSON
        $.getJSON(blogJson)
        .done(function(data) {

            var blogData = data[dataId];

            // Remove picture if exists
            $('#js-detailsview-figure').remove();

            // Place header text
            $("#js-detailsview-header").html(blogData.title);

            // Place content description
            var $detailsviewDescription = $("#js-detailsview-description");
            $detailsviewDescription.html(blogData.description);

            // CV
            createLinksList(blogData.links, $detailsviewDescription);
                
            // Remove loading state and force open and visible
            $detailsView.addClass("detailsview--open");
        })
        .fail(function() {
            console.log('Problem loading the JSON');
        })
        .always(function() {
            hideLoader();
        });
    },

    createDetailsList = function(title, ulClass, dataObj, $parentEl) {
        $parentEl.append("<hr /><h3>" + title + "</h3>");
        var $ul = $("<ul/>").addClass(ulClass),
        $div = $("<div/>").addClass('detailsview__wrapper__fakeclearcontainer'),
        n = 0;

        for (; n < dataObj.length; n++) {
            var $li = $("<li/>")
            .html(dataObj[n]);
            $ul.append($li);
        }

        $div.append($ul);
        $parentEl.append($div);
    },

    createLinksList = function(dataObj, $parentEl) {
        if (!dataObj) {
            return;
        }

        var n = 0,
        $ul = $("<ul>").addClass("detailsview__wrapper__links");

        for (; n < dataObj.length; n++) {
            var $li = $("<li/>"),
            $a = $('<a/>');

            $a.addClass("detailsview__wrapper__links__link")
            .text(dataObj[n][0])
            .attr("href", dataObj[n][1])
            .attr("target", "_blank");

            $ul.append($li);
            $li.append($a);
        }

        $parentEl.append("<hr />")
        .append($ul)
        .append("<div class='clearfix'></div>");
    };

    // Public API
    return {
        
        init: function() {
            
            // Setup module vars
            $detailsView =  $("#js-detailsview");
            $loadingBG = $('#js-loading-bg');
            
        },

        open: open,

        close: close,

        showLoader: showLoader,

        hideLoader: hideLoader
        
    };

});
