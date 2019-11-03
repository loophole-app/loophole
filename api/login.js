const fetch = require('node-fetch');
require('string.prototype.endswith');
const uuidv4 = require('uuid/v4');
let btoa = input => Buffer.from(input).toString('base64');
module.exports = async (req, res) => {
	let year = new Date().getFullYear();
	let devOS = "iPhone9,4";
	let devToken = uuidv4();
	let version = 3;
	let post = null;
	let body = [];
	req.on('data', (chunk) => {
		body.push(chunk);
	}).on('end', async () => {
		body = Buffer.concat(body).toString();
		try {
			post = JSON.parse(body)
		} catch (e) {
			res.status(400);
			res.end('invalid json');
			return 0;
		}
		if(!("username" in post && "password" in post && "domain" in post)) {
			res.status(400);
			res.end('required parameters not specified');
			return 0;
		}
		let username = post.username;
		let password = post.password;
		let domain = String(post.domain);
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
	})
}