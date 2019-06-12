autocomplete(document.getElementById("schoolInput"), names);
if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js');
}
document.getElementById("password").addEventListener("keydown", event => {
	if(event.keyCode == 13) {
		sender();
	}
});
document.getElementById("username").addEventListener("keydown", event => {
	if(event.keyCode == 13) {
		document.getElementById("password").focus();
	}
});
let sender = async function() {
	load_start();
	schoolName = document.getElementById("schoolInput").value;
	username = document.getElementById("username").value;
	password = document.getElementById("password").value;
	if(schoolName == "") {
		alert("Enter a school name");
		load_stop();
		return;
	} else if(username == "") {
		alert("Enter a username");
		load_stop();
		return;
	} else if(password == "") {
		alert("Enter a password")
		load_stop();
		return;
	}
	school_url = schoolURLFromName(schoolName);
	if(!school_url) {
		alert("Invalid school name");
		load_stop();
		return;
	}
	login_url = loginURL(school_url);
	var headers = new Headers();
	var basic = btoa(`${username}:${password}`)
	let request = await fetch(login_url, {
		headers: {
			"Authorization": `Basic ${basic}`,
			"origin": "*"
		}
	});
	let binary = await request.arrayBuffer();
	let response = new TextDecoder().decode(binary);
	console.log(login_url);
	console.log(request.status);
	load_stop();
	if(request.status == 200) {
		alert("Login successful.");
	} else {
		alert(`Login failed: ${response}`);
	}
}
document.getElementById("submit").addEventListener("click", sender);
