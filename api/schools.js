const fetch = require('node-fetch');
module.exports = async (req, res) => {
	let fetch_res = await fetch("https://lol.schoolloop.com/mapi/schools");
	res.setHeader("Content-Type", "application/json");
	let body = await fetch_res.text();
	res.end(body);
}