const fetch = require('node-fetch');
require('string.prototype.endswith');
const uuidv4 = require('uuid/v4');
let btoa = input => Buffer.from(input).toString('base64');
module.exports = async (req, res) => {
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
	if(req.headers['loophole-studentid'] == null) {
		res.status(400);
		res.end('no student ID specified');
	}
	let username = req.headers['loophole-username'];
	let password = req.headers['loophole-password'];
	let studentid = req.headers['loophole-studentid'];
	let domain = String(req.headers['loophole-domain']);
	if(!domain.endsWith('.schoolloop.com')) {
		res.status(400);
		res.end('dangerous domain');
		return 0;
	}
	let coursesURL = `https://${domain}/mapi/report_card?studentID=${studentid}`;
	let basic = btoa(`${username}:${password}`);
	let response = await fetch(coursesURL, {
		headers: {
			"Authorization": `Basic ${basic}`
		}
	});
	res.status(response.status);
	res.end(await response.text());
}