const fs = require('fs');

const mimes = JSON.parse(fs.readFileSync('./mimes.json', 'utf8'));

module.exports = function getContentType(extension) {
	if (Object.keys(mimes).includes(extension.toLowerCase())) {
		return mimes[extension.toLowerCase()];
	} else {
		return 'text/plain';
	}
};