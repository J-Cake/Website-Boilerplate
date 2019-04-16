const fs = require('fs');
const path = require('path');

const template = fs.readFileSync(path.join(__dirname + "/../", "template.html")).toString();
const constructs = require('../constructs/constructs.config');

module.exports = function format(string, vars = {}) {
	string = string.toString();

	let output = template.replace("#content#", string);

	Object.keys(vars).forEach(i => {
		const regex = new RegExp(`#=${i}#`, 'g');
		output = output.replace(regex, match => vars[i]);
	});

	Object.keys(constructs).forEach(i => {
		const regex = new RegExp(`(?<!\\\\)#${i}(?:\\((.[^,]+?)(?:,\\s*(.[^,]+?))*?\\))?(?!\\\\)#`, 'g');
		output = output.replace(regex, match => constructs[i](match.slice(match.indexOf('(') + 1, match.lastIndexOf(')')).split(/,\s*/)));
	});

	output = output.replace(/(?<!\\)#.[^()]+?(?!\(.+?\))(?!\\)#/g, match => {
		const fileName = path.join('./constructs', 'snippets', match.slice(1, -1));
		
		if (fs.existsSync(fileName))
			return fs.readFileSync(fileName).toString();
		else
			return `The file "${match.slice(1, -1)}" does not exist`;
	});

	return output.replace(/\\#/g, '#');
};