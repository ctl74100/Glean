var express = require('express');
var handlebars = require('express-handlebars');

/*--------------------*/
/* Require Middleware */
/*--------------------*/

// body parser is used to parse the body of an HTTP request
var bodyParser = require('body-parser');

// require session library
var session = require('express-session');

// require flash library
var flash = require('connect-flash');

// cookie parser is used to parse cookies in an HTTP header
var cookieParser = require('cookie-parser');

// morgan for server logging
var morgan = require('morgan');

// user database
var db = require('./lib/database.js');
////////////////////////////////////////////////////////////////////////
//test database.js
// db.getCollection({},db.User,function(err,users){
// 	if(err){
// 		console.log('error')
// 	}
// 	else{
// 		var list={};
// 		users.forEach(function(user){
// 			list[user._id]=user;
// 			//console.log(user);
// 		});
// console.log(list);
// 	}
// });
//db.addTransaction('5655157cffee0a7014017884', '5655157cffee0a7014017884' , 2.5 , "Amazon", "FakeCharity");

///////////////////////////////////////////////////////////////////////
/*------------*/
/* Create App */
/*------------*/

// create the app
var app = express();

// set port number
app.set('port', process.env.PORT || 3000);

/*------------------*/
/* Middleware Setup */
/*------------------*/

// static file serving
app.use(express.static(__dirname + '/public'));

//set up handlebars view engine
var view = handlebars.create({ defaultLayout:'main' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cookie parser
app.use(cookieParser());

// session support
app.use(session({
  secret: 'octocat', // in-class key used for now
  saveUninitialized: false,
  resave: false
}));

// flash support.
app.use(flash());

// morgan logging support.
// using 'combined' gives you Apache-style logging support.
app.use(morgan('combined'));

// A list of users who are online:
var online = require('./lib/online').online;

/*-------------*/
/* Route Setup */
/*-------------*/

// This adds the external router defined routes to the app.
app.use('/user', require('./routes/user-routes'));
app.use('/admin', require('./routes/admin-routes'));

var team = require('./lib/team.js');

/*-------------------------*/
/*  Generic Public Routes  */
/* (non-users & non-admin) */
/*-------------------------*/
 app.get('/about', (req, res) => {
 	res.render('about',{layout:false});
 });

 app.get('/register', (req, res) => {
 	var message = req.flash('register') || '';
 	res.render('register', { message : message });
 });

 app.get('/forgotpassword', (req, res) => {
 	res.render('forgotpassword');
 });

app.get('/team*', (req, res) => {
	if(Object.keys(req.query).length === 0){
		if(req.path==='/team'||req.path==='/team/'){
			var result = team.all();
		}
		else{
			res.status(404);
			res.render('404');
		}
	}
	else{
		var result = team.one(req.query.user);
	}
	if(result.count!==0){
		res.render('team', {layout:false,
			members: result.data,
		});
	}
	else{
		res.status(404);
		res.render('404');
	}
});

// /*-------------------------*/
// /*  Need to decide Router  */
// /*-------------------------*/
app.get('/', (req, res) => {

  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user.name]) {
    if(!(user.admin)){
    	req.flash('userhome','You are User')
	 res.redirect('/user/home');
  }
  else { // send to admin homepage if admin
	 req.flash('adminhome','You are Admin')
	 res.redirect('/admin/home');
  }
    }
    else {
      // send to public homepage
      res.render('home', {});
    }

});

app.get('/logout', (req, res) => {
	res.redirect('/user/logout');
});


app.get('/dash', (req, res) => {
	res.redirect('/user/dash');
});

 app.get('/login', (req, res) => {
 	res.redirect('/user/login');
 });

app.get('/profile', (req, res) => {
	res.redirect('/user/profile');
});

app.get('/admin', (req, res) => {
	res.redirect('/admin/admin');
});

app.post('/adduser', (req, res) => {
	var name = req.body.name;
	var admin = false;
	var pass=req.body.pass;
	var cpass=req.body.cpass;
	var email=req.body.email;
	var fname=req.body.fname;
	var lname=req.body.lname;
	var question=req.body.question;
	var answer=req.body.answer;
	if (!name || !pass || !cpass||!email||!fname||!lname||!question||!answer) {
		req.flash('register', 'Missing Input');
		res.redirect('/register');
	}
	else if(pass!==cpass){
		req.flash('register', 'Two passwords are not match');
		res.redirect('/register');
	}
	else{
		db.addUser(name,fname,lname,pass,email,question,answer,admin);
		req.flash('login', 'Signed up! Please log in.');
		res.redirect('/login');
	}
});

app.use((req, res) => {
	res.status(404);
	res.render('404',{layout:false});
});

/*----------------*/
/*  Error Routes  */
/*----------------*/
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500);
	res.render('500',{layout:false});
});

/*----------------*/
/*  Start Server  */
/*----------------*/
app.listen(app.get('port'), () => {
	console.log( 'Express started on http://localhost:' +
			app.get('port') + '; press Ctrl-C to terminate.' );
});
