const getExtension = require('../utilities/getExtension');

module.exports = function (router) { // You can put routes here from any HTTP method, but to keep things neat, place different methods or subroutes in individual files.
	router.addRoute("get", /^(.+\/)*(.+\..+)\/?$/, function (req, res) { // match everything with an extension
		if (["html", "htm"].includes(req.pathname.split('/').pop().split('.').pop()))
			router.html(req.pathname);
		else {
			if (["png", "jpg", "gif", "jpeg", "ttf", "woff", "woff2", "otf", "mp4", "m4v", "mov", "mp3", "m3a", "ogg", "wav"].includes(getExtension(req.pathname).toLowerCase())) {
				router.static(req.pathname, "base64");
			} else {
				router.static(req.pathname);
			}
		}
	});

	router.addRoute("get", "/", function (req, res) { // match /
		router.html("index.html");
	});

	router.addRoute("get", /^(.[^.]+\/)*(.[^.]+)\/?$/, function (req, res) { // match everything without an extension
		router.redirect(req.pathname + '.html');
		return {mime: "text/html"};
	});
};