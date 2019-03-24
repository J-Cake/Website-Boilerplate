module.exports = function(errorCode, file) {
	switch (errorCode) {
		case 404:
			return `The file "${file}" wasn't found`;
		default:
			return `An unknown error has occurred`;
	}
};