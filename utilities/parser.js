module.exports = function parseURL(url) {
    url = decodeURIComponent(url);
    let split = {};
    split["?"] = (url || "").split("?");
    split["path"] = split["?"][0];
    split["tmp"] = (split["?"][1] || "").split("#");
    split["#"] = split["tmp"][1];
    split["?"] = split["tmp"][0];

    let params = {};

    (split["?"] || "").split("&").forEach(i => {
        let tmp = (i || "").split("=");
        params[tmp[0]] = tmp[1];
    });

    return {
        path: encodeURI(split["path"]),
        params,
        fragments: split["#"],
        func: split['path'].split('/').slice(1).shift()
    }
};