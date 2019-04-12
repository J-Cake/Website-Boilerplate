module.exports = function(errorCode, file) {
	switch (errorCode) {
		case 404:
			return `The file "${file}" wasn't found`;
		case 500:
			return `An internal server error has occured requesting ${file}`;
		default:
			return `An unknown error has occurred`;
	}
};