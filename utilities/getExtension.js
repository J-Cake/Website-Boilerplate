module.exports = function getExtension (pathname) {
	const frags = pathname.split("/");
	return (frags.filter(i => !!i).pop().split('.').slice(1).pop() || "html").toLocaleLowerCase();
};