autocomplete(document.getElementById("schoolInput"), names);
let deferredPrompt = null;
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
window.addEventListener('beforeinstallprompt', function(e) {
	e.preventDefault();
	deferredPrompt = e;
	document.getElementById("a2hs").style.display = "inline-block";
	console.log("a2hs is available!");
});
document.getElementById("a2hs").addEventListener('click', (e) => {
	deferredPrompt.prompt();
	document.getElementById("a2hs").style.display = "none";
	deferredPrompt.userChoice.then((choiceResult) => {
		if(choiceResult.outcome == 'accepted') {
			console.log('User accepted the A2HS prompt');
		} else {
			console.log('User dismissed the A2HS prompt');
		}
		deferredPrompt = null;
	});
});
let sender = async function() {
	document.getElementById("password").blur();
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
