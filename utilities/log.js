const fs = require('fs');
const path = require('path');

module.exports = function(...string) {
	const name = path.join(__dirname, "../logs", new Date().toDateString() + ".log");

	let cont;

	if (typeof string[string.length - 1] === "boolean" && string[string.length - 1]) {
		string.pop();
		cont = string.join('');
	} else {
		cont = new Date().toLocaleString() + " : " + string.join(' ');
	}

	if (!fs.existsSync(name))
		fs.closeSync(fs.openSync(name, 'w'));

	fs.appendFileSync(name, cont + "\n");

	process.stdout.write(cont + "\n");
};