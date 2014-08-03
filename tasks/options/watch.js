/**
 * Watching for changes
 */
'use strict';

var config = require('../config');

module.exports = {
	scss: {
		files: config.compass.files,
		tasks: 'compass:dev'
	},

	js: {
		files: config.jsHintFiles,
		tasks: ['jshint']
	}
};
