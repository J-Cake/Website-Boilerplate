const path = require('path');
const log = require('./log');

module.exports = function securePath(loc) {
    let p = path.resolve(loc).replace(/\\/g, "/");

    let output = "";

    if (p.indexOf("public") === -1) {
        // process.stdout.write('\u001b[31mWarning!!! Intruder' + add + '\u001b[0m ' + '\n');
        log("Attempted breakin");

        output = path.join(__dirname, "../public", "index.html");
    } else {
        output = p;
    }

    return output;
};