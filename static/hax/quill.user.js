// ==UserScript==
// @name         Quill.org hack
// @namespace    https://sreeharis.me
// @version      69420
// @description  Sreehari's quill.org hack!
// @author       Sreehari S
// @match        *://*.quill.org/*
// @grant        none
// ==/UserScript==

var old_fetch = fetch;
function dispatchText(text) {
	console.log(text);
	let piece = document.querySelector(".connect-text-area");
	if(piece.nodeName == "TEXTAREA") {
		piece.value = text;
	} else {
		piece.innerText = text;
	}
}
window.fetch = async function() {
	if(arguments[0].endsWith("responses")) {
		let payload = await old_fetch.apply(null, arguments);
		let intercept = await payload.clone();
		let body = await intercept.json();
		for(let i=0; i<body.length; i++) {
			if(body[i].optimal) {
				setTimeout(dispatchText, 250, body[i].text);
				break;
			}
		}
		return payload;
	}
	return old_fetch.apply(null, arguments);
}
