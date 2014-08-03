var isTouchDevice = function() {
	return 'ontouchstart' in window || 'onmsgesturechange' in window; // works on ie10
}