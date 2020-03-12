const fetch = require('node-fetch');
require('string.prototype.endswith');
let btoa = input => Buffer.from(input).toString('base64');
module.exports = async (req, res) => {
	let body = [];
	let post = null;
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
		if(!("username" in post && "password" in post && "domain" in post && "studentID" in post)) {
			res.status(400);
			res.end('required parameters not specified');
			return 0;
		}
		let username = post.username;
		let password = post.password;
		let domain = String(post.domain);
		let studentID = post.studentID;
		if(!domain.endsWith('.schoolloop.com')) {
			res.status(400);
			res.end('dangerous domain');
			return 0;
		}
		let assignmentsURL = `https://${domain}/mapi/assignments?studentID=${studentID}`;
		let basic = btoa(`${username}:${password}`);
		let response = await fetch(assignmentsURL, {
			headers: {
				"Authorization": `Basic ${basic}`
			}
		});
		res.status(response.status);
		res.end(await response.text());
	})
}
