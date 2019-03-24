module.exports = function (router) { // You can put routes here from any HTTP method, but to keep things neat, building an API should be done separately.
	router.addRoute("get", /^(.+\/)*(.+\..+)\/?$/, function (req, res) { // match everything with an extension
		if (["html", "htm"].includes(req.pathname.split('/').pop().split('.').pop()))
			router.html(req.pathname);
		else
			router.static(req.pathname);
	});

	router.addRoute("get", "/", function (req, res) { // match /
		console.log('3');
		router.html("index.html");
	});

	router.addRoute("get", /^(.[^.]+\/)*(.[^.]+)\/?$/, function (req, res) { // match everything without an extension
		router.redirect(req.pathname + '.html');
		return {mime: "text/html"};
	});
};