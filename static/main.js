import Vue from './vue.js';
import VueRouter from './vue-router.js';
import {MainTemplate, About, Courses, NotFound, ProgressReport, Assignments} from './templates/default.js';
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
	updated: function() {
		this.themeColor();
	},
	methods: {
		bgcolor: function(index) {
			let colors = ["#fe938c", "#e6b89c", "#05aa83", "#a39171", "#4281a4", "#51a3a3", "#e77ab7"];
			let dark_colors = ["#730801", "#633519", "#05aa83", "#515561", "#33647f", "#3b7777"];
			let correct = localStorage.getItem("darkmode") == "yes" ? dark_colors  : colors;
			let color = correct[index % correct.length];
			return color;
		},
		themeColor: async function() {
			if(localStorage.getItem("darkmode") == "yes") {
				var css = `
body {
	background-color: #0d1114;
}
.hd {
	background: none #157FCC;
}
`
				head = document.head || document.getElementsByTagName('head')[0];
				style = document.createElement('style')
				head.appendChild(style)
				style.type = 'text/css'
				style.appendChild(document.createTextNode(css));
			}
		},
		fetchData: async function() {
			let response = await fetch("/api/courses.js", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					'username': localStorage.getItem("username"),
					'password': localStorage.getItem("password"),
					'domain': localStorage.getItem("schooldomain"),
					'studentID': localStorage.getItem("userid")
				})
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
		<router-link class="router-link g" v-bind:to="'/progress/'+item.periodID">
			<elem><pd class="theme-color">{{ item.period }}</pd></elem>
			<elem><cname class="theme-color">{{ item.courseName }}</cname><br>
				<cname class="theme-color">{{ item.teacherName }}</cname></elem>
			<elem class="right-part"><gr class="theme-color">{{ item.grade == "null" ? "" : item.grade }}</gr><br>
			<cname class="theme-color">{{ item.score == "null" ? "" : item.score }}</cname></elem>
		</span>
	</li>
</ul>
`
});
Vue.component('assignments', {
	data: function() {
		return {
			items: null
		};
	},
	created: function () {
		this.fetchData();
	},
	methods: {
		bgcolor: function(index) {
			let colors = ["#fe938c", "#e6b89c", "#05aa83", "#a39171", "#4281a4", "#51a3a3", "#e77ab7"];
			let dark_colors = ["#730801", "#633519", "#05aa83", "#515561", "#33647f", "#3b7777"];
			let correct = localStorage.getItem("darkmode") == "yes" ? dark_colors  : colors;
			let color = correct[index % correct.length];
			let r = {}
			r["background-color"] = color;
			return r;
		},
		fetchData: async function() {
			let response = await fetch('/api/assignments.js', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					'username': localStorage.getItem("username"),
					'password': localStorage.getItem("password"),
					'domain': localStorage.getItem("schooldomain"),
					'studentID': localStorage.getItem("userid")
				})
			});
			if(response.status != 200) {
				alert("Error: " + await response.text());
			} else {
				let dueDate = null;
				let now = new Date();
				let tomorrow = new Date(now);
				tomorrow.setDate(tomorrow.getDate() + 1);
				let nextweek = new Date(now);
				nextweek.setDate(nextweek.getDate() + 7);

				let item = null;
				let items = await response.json();
				let obj = {weekday: "long", month: "short", day: "numeric"}
				let final = [];
				let current = [];
				let prevDue = 6;
				for(let i=0; i < items.length; i++) {
					dueDate = new Date(Number(items[i].dueDate));
					if(now.getDate() === dueDate.getDate() && Math.abs(now.getTime() - dueDate.getTime())<24*60*60*1000) {
						// if today
						items[i].dueString = "Today"
					} else if(tomorrow.getDate() === dueDate.getDate() && Math.abs(tomorrow.getTime() - dueDate.getTime())<24*60*60*1000) {
						// due tomorrow
						items[i].dueString = "Tomorrow"
					} else if(dueDate.getDate() < nextweek.getDate() && Math.abs(nextweek.getTime() - dueDate.getTime())<7*24*60*60*1000) {
						// due next week
						items[i].dueString = dueDate.toLocaleString('en-us', {weekday: "long"});
					} else {
						//due in the future or past
						if(dueDate.getFullYear() != now.getFullYear()) {
							obj.year = "numeric"
						}
						items[i].dueString = dueDate.toLocaleString('en-us', obj);
					}
					items[i].styleObj = this.bgcolor(i);
					items[i].date = dueDate;
					if(items[i].dueString == prevDue) {
						current.push(items[i])
					} else {
						if(current.length != 0) {
							final.push(current)
						}
						current = [items[i]]
					}
					prevDue = items[i].dueString;
				}
				final.push(current);
				window.final = final;
				window.items = items;
				this.items = final;
			}
		}
	},
	template:`
<ul class="ul-grades" style="text-align: left;">
	<li class="grade-item" v-for="item in items" v-bind:style="item[0].styleObj">
	<b>{{ item[0].dueString }}</b>
	<ul>
	<li v-for="assignment in item" style="list-style-type: square;">{{ assignment.title }}</li>
	</ul>
	</li>
</ul>
`
})
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
	},
	{
		path: '/progress/:periodid',
		beforeEnter: loginGuard,
		component: ProgressReport,
		title: "Courses"
	},
	{
		path: '/assignments',
		beforeEnter: loginGuard,
		component: Assignments,
		title: "Assignments"
	},
	{
		path: "*",
		component: NotFound,
		title: "404 Not Found"
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
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			'username': username,
			'password': password,
			'domain': domain
		})
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
function logout() {
	localStorage.clear();
	app.$router.replace("/");
}
let deferredPrompt;
let installButton = document.getElementById("install");
window.addEventListener('beforeinstallprompt', (e) => {
	deferredPrompt = e;
	installButton.style.display = "inline-block";
});
installButton.addEventListener('click', (e) => {
	installButton.style.display = 'none';
	deferredPrompt.prompt();
	deferredPrompt.userChoice.then((choiceResult) => {
		if(choiceResult.outcome === 'accepted') {
			console.log('User accepted A2HS');
		} else {
			console.log('User dismissed A2HS');
		}
		deferredPrompt = null;
	});
});
window.toggleDark = () => localStorage.setItem("darkmode", localStorage.getItem("darkmode") == "yes" ? "no" : "yes");
// complete rewrite of the old generation
window.logout = logout;
window.app = app;
window.load_start = load_start;
window.load_stop = load_stop;
if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw.js');
}