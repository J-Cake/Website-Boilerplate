const http = require("http");
const url = require("url");

const Router = require("./utilities/router");
const log = require("./utilities/log");

http.IncomingMessage.prototype.appendBody = function (text) {
	this.body = this.body || [];
	this.body.push(text);
};

http.ServerResponse.prototype.send = function (body, encoding = "utf8") {
	if (typeof body === 'string') {
		if (this.method !== "HEAD") { // there's no body in a HEAD request so don't send it.
			if (this.headersSent) {
				this.write(body, encoding);
			} else {
				this.return.push(body);
				this.encodings.push(encoding);
			}
		}
	}
};

http.ServerResponse.prototype.doNotEnd = function () {
	this.suppressEnd = true;
};

const port = process.argv[2] || 1080;

process.root = __dirname.replace(/\\/g, "/"); // specifies where the server is started from (/)

http.createServer(async (req, res) => {
	res.suppressEnd = false;
	res.return = [];
	res.encodings = [];

	const location = url.parse(req.url);

	const newPath = location.pathname.split('/');

	while (!newPath[newPath.length - 1]) {
		newPath.pop();

		if (newPath.length <= 0)
			break;
	}

	location.pathname = newPath.join('/');

	if (location.pathname === "")
		location.pathname = "/";

	res.method = req.method;

	const call = () => {
		req = {
			...req,
			...location
		};

		const status = Router.callRoute(req.method, location.pathname, req, res);

		log(req.method.toUpperCase(), location.pathname, (status.headers || {})["Content-type"] || "text/html", status.code);

		res.writeHead(status.code, {
			...status.headers,
			"Content-type": (status.headers || {})["Content-type"] || status.mime || "text/html"
		});
		res.headersSent = true;

		res.return.forEach((i, a) => {
			res.write(i, res.encodings[a]);
		});

		if (!res.suppressEnd)
			res.end();
	};

	if (req.method !== "GET") {
		req.on("data", data => req.appendBody(data));
		req.on("end", call);
	} else {
		call();
	}
}).listen(port, e => {
	if (e) throw e;
	log("Listening on", port);
});