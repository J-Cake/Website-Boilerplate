const getExtension = require('../utilities/getExtension');
const assert = require('assert');

describe("Extension", function() {
	it("extension: HTML", function() {
		assert.equal(getExtension("/path/to/file/file/"), "html")
	})
});