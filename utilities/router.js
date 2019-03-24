const fs = require('fs');
const path = require('path');
const url = require('url');
const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "COPY", "HEAD", "OPTIONS", "LINK", "UNLINK", "PURGE", "LOCK", "UNLOCK", "PROPFIND", "VIEW"];

const format = require('./format');
const securePath = require('./securePath');
const log = require('./log');

const errors = require('../routes/errors.js');

const getMime = require('./getMimeType');
const getExtension = require('./getExtension');

const Router = class Router {
	constructor() {
		this.constructor.routes = [];

		methods.map(i => `${path.join(__dirname, '../routes', i)}.js`).filter(i => fs.existsSync(i)).map(i => require(i)(this)); // load all routes
	}

	html(location) {
		const file = securePath(path.join(__dirname, "../public", location));

		if (fs.existsSync(file)) {
			this.res.send(format(fs.readFileSync(file).toString()));
			this.status = 200;
		} else {
			this.res.send(format(Router.error(404, location)));
			this.status = 404;
			this.mime = "text/html";
		}
	}

	static(location) {
		const file = securePath(path.join(__dirname, "../public", location));

		if (fs.existsSync(file)) {
			this.res.send(fs.readFileSync(file).toString());
			this.status = 200;
		} else {
			this.res.send(Router.error(404, location));
			this.status = 404;
		}
	}

	static error(code, file) {
		return `Error ${code}: ${errors(code, file)}`;
	}

	addRoute(method = "GET", path, callback) {
		if (path instanceof RegExp || typeof path === "string")
			if (Router.routes.filter(i => i.method === method.toUpperCase() && i.path === path).length <= 0)
				Router.routes.push({
					path,
					method: method.toUpperCase(),
					callback
				});
			else
				throw new TypeError("Path must be either string or regular expression");
	}

	callRoute(method, path, request, response) {
		this.req = request;
		this.res = response;

		delete this.mime; // it is preserved over previous iterations of requests, therefore influencing the output of the router

		const routes = Router.routes.filter(i => i && (i.method.toUpperCase() === method.toUpperCase() && (i.path instanceof RegExp ? i.path.test(path) : i.path === path)));

		if (routes.length === 0) {
			return void this.res.send(Router.error(404, path)) || {
				code: 404,
				mime: getMime(getExtension(this.req.pathname)) // (request.pathname.split('/').pop() || "index.html").split('.').pop() || ".html"
			};
		}

		const status = routes.map(i => typeof i.callback === "function" ? i.callback(this.req, this.res) || {} : (typeof i.callback === "object") ? i.callback : (function () {
			throw new Error("Callback must be either a function or object");
		}).bind(this)).pop() || {};
		const mime = this.mime;

		return {
			code: (status.code || this.status) || 200,
			headers: {
				...(status.headers || {}),
				"Content-type": mime || ((!status.mime || status.mime === "auto") ? getMime((request.pathname.split('/').pop() || "index.html").split('.').pop() || ".html") : status.mime),
				"Content-length": Buffer.byteLength((this.res.return || []).join(''))
			}
		};
	}

	deleteRoute(method, path) {
		Router.routes.splice(Router.routes.find(arg => arg.method.toUpperCase() === method.toUpperCase() && path === arg.path), 1);
	}

	redirect(_url) {
		this.req = {...this.req, ...url.parse(_url)};
		this.callRoute.bind(this)(this.req.method, _url, this.req, this.res);
	};
};

module.exports = new Router();