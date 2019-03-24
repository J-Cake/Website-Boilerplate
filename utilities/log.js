const fs = require('fs');
const path = require('path');

module.exports = function(...string) {
	const name = path.join(__dirname, "../logs", new Date().toDateString() + ".log");
	const cont = string.join(' ');

	if (!fs.existsSync(name))
		fs.closeSync(fs.openSync(name, 'w'));

	fs.appendFileSync(name, new Date().toLocaleString() + " : " + cont + "\n");

	console.log(cont);
};