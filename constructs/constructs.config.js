const fs = require('fs'),
	path = require('path');

const comp = require('../MDCompiler');

const compile = md => comp().render(md);

module.exports = {
	"markdown": args => args.map(i => {
		const file = path.join(__dirname, 'markdown', i);
		console.log(file);

		if (fs.existsSync(file))
			return `<article>${compile(fs.readFileSync(file, 'utf8'))}</article>`;
		else
			return `<div class="error">The file "${file}" does not exist</div>`;

	}).join(`<br/>`),

	"script": args => args.map(i => {
		const file = path.join(__dirname, 'scripts', i);
		console.log(file);

		if (fs.existsSync(file))
			eval(fs.readFileSync(file, 'utf8'));
		else
			return `<div class="error">The file "${file}" does not exist</div>`;
	}).join(`<br/>`)
};