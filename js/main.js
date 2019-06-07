let schools_url = "https://lol.schoolloop.com/mapi/schools"
let schools = null;
let names = new Array();
async function getSchools() {
	let request = await fetch(schools_url);
	let json = new TextDecoder().decode(await request.arrayBuffer());
	let obj = JSON.parse(json);
	for(i = 0; i < obj.length; i++) {
		names.push(obj[i].name);
	}
	return obj;
}
getSchools().then(obj => {
	schools = Array.from(obj);
});
function autocomplete(input, arr) {
	var currentFocus;
	input.addEventListener("input", function(e) {
		var a, b, i, val = this.value;
		closeAllLists();
		if(!val) {
			return false;
		}
		currentFocus = -1;
		a = document.createElement("DIV");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");
		this.parentNode.appendChild(a);
		for(i = 0; i < arr.length; i++) {
			if(arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				b = document.createElement("DIV");
				b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
				b.innerHTML += arr[i].substr(val.length);
				b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
				b.addEventListener("click", function(e) {
					input.value = this.getElementsByTagName("input")[0].value;
					closeAllLists();
				});
				a.appendChild(b);
			}
		}
	});
	input.addEventListener("keydown", function(e) {
		var x = document.getElementById(this.id + "autocomplete-list");
		if(x) x = x.getElementsByTagName("div");
		if(e.keyCode == 40) {
			currentFocus++;
			addActive(x);
		} else if(e.keyCode == 38) {
			currentFocus--;
			addActive(x);
		} else if(e.keyCode == 13) {
			e.preventDefault();
			if(currentFocus > -1) {
				if(x) x[currentFocus].click();
			}
		}
	});
	function addActive(x) {
		if (!x) return false;
		removeActive(x);
		if(currentFocus >= x.length) currentFocus = 0;
		if(currentFocus < 0) currentFocus = (x.length - 1);
		x[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(x) {
		for(var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}
	function closeAllLists(elmnt) {
		var x = document.getElementsByClassName("autocomplete-items");
		for(var i = 0; i < x.length; i++) {
			if(elmnt != x[i] && elmnt != input) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	document.addEventListener("click", function(e) {
		closeAllLists(e.target);
	});
}
