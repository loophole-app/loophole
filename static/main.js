import Vue from './vue.js';
import VueRouter from './vue-router.js';
import {MainTemplate, About, Courses} from './templates/default.js';
//Loophole by Sreehari Sreedev
Vue.use(VueRouter);
Vue.component('grade-items', {
	data: function () {
		return {
			items: null
		}
	},
	created: function () {
		this.fetchData();
	},
	methods: {
		bgcolor: function(index) {
			let colors = ["#fe938c", "#e6b89c", "#05aa83", "#696d7d", "#4281a4", "#51a3a3"];
			let color = colors[index % 6];
			return color;
		},
		fetchData: async function() {
			let response = await fetch("/api/courses.js", {
				headers: {
					"loophole-username": localStorage.getItem("username"),
					"loophole-password": localStorage.getItem("password"),
					"loophole-domain": localStorage.getItem("schooldomain"),
					"loophole-studentid": localStorage.getItem("userid")
				}
			});
			if(response.status != 200) {
				alert("Error: " + await response.text());
			} else {
				this.items = await response.json();
			}
			for(let i=0; i<this.items.length; i++) {
				this.items[i].styleObj = {}
				this.items[i].styleObj["background-color"] = this.bgcolor(i);
			}
		}
	},
	template: `
<ul class="ul-grades">
	<li class="grade-item" v-for="item in items" v-bind:style="item.styleObj">
		<span class="g" v-bind:period="item.periodID">
			<elem><pd>{{ item.period }}</pd></elem>
			<elem><cname>{{ item.courseName }}</cname><br>
				<cname>{{ item.teacherName }}</cname></elem>
			<elem class="right-part"><gr>{{ item.grade == "null" ? "" : item.grade }}</gr><br>
			<cname>{{ item.score == "null" ? "" : item.score }}</cname></elem>
		</span>
	</li>
</ul>
`
});

function bgcolor(index) {
	colors = ["#e7e247", "#7ea16b", "#4c3b4d", "#a53860", "#61c9a8", "#1e152a"];
	color = colors[index % 6];
	return color;
}
let sending = false;
const router = new VueRouter({
	mode: 'history',
	routes: [{
		path: '/about',
		component: About,
		title: "About"
	}, {
		path: '/',
		beforeEnter: (to, from, next) => {
			if(localStorage.getItem("logged_in") == "true") {
				next("/courses");
			} else {
				next();
			}
		},
		component: MainTemplate,
		title: "Loophole"
	}, {
		path: '/courses',
		beforeEnter: loginGuard,
		component: Courses,
		title: "Courses"
	}]
});
function loginGuard(to, from, next) {
	if(localStorage.getItem("logged_in") == "true") {
		next();
	} else {
		next("/");
	}
}
const app = new Vue({
	el: "#app",
	router,
	data () {
		return {
			prevHeight: 0
		};
	},
	/*created () {
		this.$router.beforeEach((to, from, next) => {
			next();
		});
	},*/
	methods: {
		beforeLeave(element) {
			this.prevHeight = getComputedStyle(element).height;
		},
		enter(element) {
			const {height} = getComputedStyle(element);
			element.style.height = this.prevHeight;
			setTimeout(() => {
				element.style.height = height;
			});
		},
		afterEnter(element) {
			element.style.height = 'auto';
		}
	},
	mounted: mupdate,
	updated: mupdate
});
async function mupdate() {
	if(this.$route.path == "/") {
		let schools = await fetch("/api/schools.js").then(r => r.json()).then(o => {return o;});
		await autocomplete(document.getElementById("schoolInput"), schools);
	}
	if(this.$route.path == "/courses") {
		document.getElementById("hdr").addEventListener(click, logout);
	}
}
async function autocomplete(input, arr) {
	var currentFocus;
	input.addEventListener("input", function(e) {
		var a, b, i, val = this.value;
		closeAllLists();
		if(!val) {
			return false;
		}
		currentFocus = -1;
		a = document.createElement("div");
		a.setAttribute("id", this.id + "-autocomplete-list");
		a.setAttribute("class", "autocomplete-items");
		this.parentNode.appendChild(a);
		for(i = 0; i < arr.length; i++) {
			if(arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				b = document.createElement("div");
				b.style.background = "#eee";
				b.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
				b.innerHTML += arr[i].name.substr(val.length);
				b.innerHTML += "<input type='hidden' value='" + arr[i].name + "' domain='" + arr[i].domainName + "'>";
				b.addEventListener("click", function(e) {
					input.value = this.getElementsByTagName("input")[0].value;
					input.setAttribute("domain", this.getElementsByTagName("input")[0].getAttribute("domain"));
					closeAllLists();
					document.getElementById("username").focus();
				});
				a.appendChild(b);
			}
		}
	});
	input.addEventListener("keydown", function(e) {
		var x = document.getElementById(this.id + "-autocomplete-list");
		if(x) x = x.getElementsByTagName("div");
		if(e.keyCode == 40) {
			currentFocus++;
			addActive(x);
		} else if(e.keyCode == 38) {
			currentFocus--;
			addActive(x);
		} else if(e.keyCode == 13) {
			if(x.length == 1) {
				x[0].click();
				document.getElementById("username").focus();
			} else {
				e.preventDefault();
				if(currentFocus > -1) {
					if(x) x[currentFocus].click();
				}
			}
		}
	});
	function addActive(x) {
		if(!x) return false;
		removeActive(x);
		if(currentFocus >= x.length) currentFocus = 0;
		if(currentFocus < 0) currentFocus = (x.length - 1);
		x[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(x) {
		for(var i=0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}
	function closeAllLists(elmnt) {
		var x = document.getElementsByClassName("autocomplete-items");
		for(var i=0; i < x.length; i++) {
			if(elmnt != x[i] && elmnt != input) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	document.addEventListener("click", function(e) {
		closeAllLists(e.target);
	});
	addEnter();
}
async function addEnter() {
	let usernameElem = document.getElementById("username");
	let passwordElem = document.getElementById("password");
	let schoolElem = document.getElementById("schoolInput");
	let submitButton = document.getElementById("submit");
	passwordElem.addEventListener("keydown", e => {
		if(e.keyCode == 13) {
			if(schoolElem.value == "") {
				alert("Enter a School");
				return;
			}
			sender(usernameElem.value, passwordElem.value, document.getElementById("schoolInput").getAttribute("domain"));
		}
	});
	usernameElem.addEventListener("keydown", e => {
		if(e.keyCode == 13) {
			passwordElem.focus();
		}
	});
	submit.addEventListener("click", e => {
		sender(usernameElem.value, passwordElem.value, document.getElementById("schoolInput").getAttribute("domain"));
	});
}
async function sender(username, password, domain) {
	if(sending) return;
	sending = true;
	load_start();
	if(!domain) {
		alert("Click or tap on a school from the list, or press enter in the school input");
		sending = false;
		load_stop();
		return;
	}
	let response = await fetch("/api/login.js", {
		headers: {
			"loophole-username": username,
			"loophole-password": password,
			"loophole-domain": domain
		}
	});
	load_stop();
	sending = false;
	let status = response.status;
	if(status == 200) {
		let obj = await response.json();
		storeCredentials(obj, password);
		app.$router.push("/courses");
	} else {
		alert(await response.text());
	}
}
function storeCredentials(obj, passwd) {
	let map = {
		logged_in: "true",
		username: obj.userName,
		password: passwd,
		userid: obj.userID,
		name: obj.fullName,
		email: obj.email,
		schoolname: obj.students[0].school.name,
		schooldomain: obj.students[0].school.domainName,
		schooldistrict: obj.students[0].school.districtName
	};
	for(var key in map) {
		localStorage.setItem(key, map[key]);
	}
}
function load_start() {
	let submit = document.getElementById("lastbr");
	let loader = document.createElement("div");
	loader.id = "loader";
	submit.parentNode.insertBefore(loader, submit.nextSibling)
}
function load_stop() {
	let loader = document.getElementById("loader");
	loader.remove();
}
// complete rewrite of the old generation
window.app = app;
window.load_start = load_start;
window.load_stop = load_stop;
function logout() {
	localStorage.clear();
	app.$router.replace("/");
}
/*if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./static/sw.js');
}*/
