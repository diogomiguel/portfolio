	/**
 * Sass
 */
'use strict';

var config = require('../config');

module.exports = {
	dev: {
		options: {
			sassDir: config.compass.sassDir,
			cssDir: config.compass.cssDir,
			outputStyle: 'expanded',
			environment: 'development'
		},
	},

	build: {
		options: {
			sassDir: config.compass.sassDir,
			cssDir: config.compass.cssDir,
			outputStyle: 'compressed',
			environment: 'production'
		}
	}
};
