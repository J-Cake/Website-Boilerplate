const fs = require('fs');
const path = require('path');

const template = fs.readFileSync(path.join(__dirname + "/../", "template.html")).toString();
const constructs = require('../constructs/constructs.config');

module.exports = function (string = "", vars = {}, templates = {}) {
    string = string.toString();
    const rules = [];

    const lines = string.split("\n").map(i => i);

    for (let i of lines)
        if (/^#!.+#$/.test(i.trim()))
            rules.push(i.slice(2, -1));
        else break;

    return format(lines.slice(rules.length).join('\n'), vars, templates, rules);

};

function format(string, vars = {}, templates = {}, rules) {
    if (!rules.includes('noBody'))
        string = `<div class="body">${string.toString()}</div>`;
    else
        string = string.toString();

    let output = template.replace("#content#", string);
    Object.keys(templates).forEach(i => template.replace(`#${i}#`, templates[i]));

    output = output.replace(/#=([\S\s]+?)#/g, match => {
        const values = Object.values(vars).map(i => JSON.stringify(i));
        const variables = "const [" + Object.keys(vars).join(', ') + "] = [" + values + "].map(i => p(i));";
        const fnc = `(function () {let p=a=>{try{return JSON.parse(a)}catch(err){return a}};${variables};return ${match.slice(2, -1)}})()`;

        const output = eval(fnc);

        if (output instanceof Array)
            return output.join(" ");
        else
            return output;
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
}