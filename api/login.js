const fetch = require('node-fetch');
require('string.prototype.endswith');
const uuidv4 = require('uuid/v4');
let btoa = input => Buffer.from(input).toString('base64');
module.exports = async (req, res) => {
	let year = new Date().getFullYear();
	let devOS = "iPhone9,4";
	let devToken = uuidv4();
	let version = 3;
	if(!('loophole-username' in req.headers) || !('loophole-password' in req.headers)) {
		res.status(400);
		res.end('username or password not specified');
		return 0;
	}
	if(req.headers['loophole-domain'] === null) {
		res.status(400);
		res.end('no domain specified');
		return 0;
	}
	let username = req.headers['loophole-username'];
	let password = req.headers['loophole-password'];
	let domain = String(req.headers['loophole-domain']);
	if(!domain.endsWith('.schoolloop.com')) {
		res.status(400);
		res.end('dangerous domain');
		return 0;
	}
	let loginURL = `https://${domain}/mapi/login?version=${version}&devToken=${devToken}&devOS=${devOS}&year=${year}`;
	let basic = btoa(`${username}:${password}`);
	let response = await fetch(loginURL, {
		headers: {
			"Authorization": `Basic ${basic}`
		}
	});
	res.status(response.status);
	res.end(await response.text());
}