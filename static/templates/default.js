const MainTemplate = {template:`
	<div id="body"><div class="header">
		<h1 class="hd">Loophole</h1>
	</div>
	<br>
	<picture>
		<source type="image/webp" srcset="static/512.webp">
		<img src="static/512.png" class="logo"></img>
	</picture>
	<br><br>
	<div class="autocomplete">
		<input id="schoolInput" type="text" placeholder="school" autocomplete="off">
	</div>
	<br><br>
	<input id="username" type="text" autocorrect="off" autocapitalize="none" autocomplete="off" placeholder="username">
	<br><br>
	<input id="password" type="password" placeholder="password">
	<br><br>
	<button id="submit">Log In</button><br>
	<button id="install" style="display: none;">Install</button>
	<br><br id="lastbr">
	<router-link to="/about">About Us</router-link>
	<br>
	</div>
`}
const About = {template:`
	<div id="body"><div class="header">
		<h1 class="hd" id="hdr">about</h1>
	</div>
	<div class="center">
	<div class="about">
	<p>loophole is an alternative School Loop client. It was written because the default client is a bit limited feature-wise. We chose to write Loophole as a PWA (Progressive Web-App) so that it would be compatible with as many devices as possible.</p>
	<p>written by Sreehari Sreedev</p>
	<router-link to="/">Back</router-link>
	</div>
	</div>
	</div>
`}
const Courses = {template:`
	<div id="body">
	<div class="header">
		<h1 class="hd app-header theme-color">Courses <i class="fas fa-caret-down"></i></h1>
		<i onclick='logout()' class="fas fa-power-off fa-3x theme-color" id="logout"></i>
	</div>
	<br>
	<div id="grades">
	<grade-items></grade-items>
	</div>
	</div>
`};
const NotFound = {template:`
	<div id="body">
		<div class="header">
			<h1 class="hd" id="hdr">404 Not Found</h1>
		</div>
		<div class="center">
		<div class="about">
		<h3>The page you were looking for was not found! You can try to go to our <router-link to="/">home page</router-link>.</h3>
		</div>
		</div>
	</div>
`}
const ProgressReport = {template:`
	<div id="body">
	<div class="header">
		<h1 class="hd" id="hdr"><router-link class="router-link" to="/courses"><i class="fa-fw fas fa-arrow-left"></i></router-link> Progress Report</h1>
	</div>
	<div class="center">
	
	</div>
	</div>
`}
const Assignments = {template:`
	<div id="body">
		<div class="header">
			<h1 class="hd app-header theme-color">Assignments <i class="fas fa-caret-down"></i></h1>
			<i onclick='logout()' class="fas fa-power-off fa-3x theme-color" id="logout"></i>
		</div>
		<div id="assignments">
		<br>
		<assignments></assignments>
		</div>
	</div>
`}
export { MainTemplate, About, Courses, ProgressReport, NotFound, Assignments }
