var express = require('express');

//This gives us access to the user "model".
var model = require('../lib/user');

//A list of users who are online:
var online = require('../lib/online').online;
var db = require('../lib/database.js');

//This creates an express "router" that allows us to separate
//particular routes from the main application.
var router = express.Router();

router.get('/home', (req, res) => {
	var user = req.session.user;
	if(!user){
		req.flash('home', 'You are not logged in');
		 res.redirect('/user/home');
	}
	else{
		if(!online[user.name]){
			req.flash('login', 'You are not logged in');
			res.redirect('/user/home');
		}
		else{
			if(!(user.admin)){
				req.flash('userhome', 'You are not admin');
				res.redirect('/user/home');
			}
			else{
				db.getCollection({},db.User,function(err,users){
					if(err){
						console.log('error');
					}
					else{
						var listuser={};
						var numuser=0;
						users.forEach(function(user){
						
						numuser++;
						});



							db.getCollection({},db.User,function(err,tt){
					if(err){
						console.log('error');
					}
					else{
						var listt={};
						var numt=0;
						tt.forEach(function(ttt){
						
						numt+=ttt.donated;
						});

						var message = req.flash('adminhome') || '';

    					res.render('adminhome', { 
    					  title   : 'Admin Home', layout:'adminmain',
                          message : message ,
                          name: user.name,
                          numuser:numuser,
                          totalt:numt
                      });
					}
				});




					}
				});


			}
		}
	}
});

router.get('/admin', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user.name]) {
    if((user.admin)){
    var message = req.flash('admin') || '';

	db.getCollection({},db.User,function(err,users){
	if(err){
		console.log('error')
	}
	else{
		var list={};
		var list_a={};
		users.forEach(function(user){
			if(user.admin==false){
				list[user._id]=user;
			}
			else{
				list_a[user._id]=user;
			}
			
			// console.log(user);
		});
		//console.log(list);
		db.getCollection({},db.Transaction,function(error,trans){
			if(error){

			}
			else{
				var translist={};
				trans.forEach(function(tr){
					translist[tr._id]=tr;
				});
				var addadmin = req.flash('addadmin') || '';
				 res.render('admin', { title   : 'Admin', layout:'adminmain',addadmin:addadmin,
                          message : message ,
 							translist:translist,
                      		list: list,
                      		list_a:list_a});
			}
		});

	}
});

}
else{
	req.flash('userhome','You are not Admin');
	res.redirect('/user/home');
}
  }
  else {
    // Grab any messages being sent to us from redirect:
    req.flash('login', 'You are not logged in')
    res.redirect('/user/login');
  }
});

// NO USE FOR NOW
router.get('/list', (req, res) => {

	var user = req.session.user;
	if(!user){
		req.flash('login', 'Not logged in');
		res.redirect('/user/login');
	}
	else{
		if(!online[user.name]){
			req.flash('login', 'Login expired');
			res.redirect('/user/login');
		}
		else{
			if(!(user.admin)){
				req.flash('main', 'You are not admin');
				res.redirect('/user/main');
			}
			else{
				var message = req.flash('list') || 'List Successful';
				var list;
				model.list(function(error, users){
					if(error){
						req.flash('main', error);
						res.redirect('/user/main');
					}
					else{
						list=users;
						res.render('user-list', {
							title: 'User List',
							message : message ,
							users: list
						});
					}
				});
			}
		}
	}
});

router.post('/addadmin', (req, res) => {
	var name = req.body.name;
	var admin = true;
	var pass=req.body.pass;
	var cpass=req.body.cpass;
	var fname=req.body.fname;
	var lname=req.body.lname;
	var email=req.body.email;

	if (!name || !pass || !cpass) {
		req.flash('addadmin', 'Missing Input');
		res.redirect('/admin/admin');
	}
	else if(pass!==cpass){
		req.flash('addadmin', 'Two passwords are not match');
		res.redirect('/admin/admin');
	}
	else{
		db.addUser(name,fname,lname,pass,email,"question","answer",admin);
		req.flash('addadmin', 'Admin added!');
		res.redirect('/admin/admin');
	}
});

router.post('/findcharity', (req, res) =>{
    var user = req.session.user;
    var charity = req.body.charity;

    if(!charity){
      console.log("missing input");
      //req.flash('profile','Missing input!!!');
    res.redirect('/admin/admin');
    }
    else{
      //console.log('user id is: '+user._id);
if (user && online[user.name]) {
    if((user.admin)){
    var message = req.flash('admin') || '';

	db.getCollection({},db.User,function(err,users){
	if(err){
		console.log('error')
	}
	else{
		var list={};
		users.forEach(function(user){
			list[user._id]=user;
			// console.log(user);
		});
		//console.log(list);
		db.getCollection({},db.Transaction,function(error,trans){
			if(error){

			}
			else{
				var translist={};
				trans.forEach(function(tr){
					translist[tr._id]=tr;
				});
db.getObject({name:charity},db.Charity, function(error, c){
    		if(error){
    			console.log(error);
    		}
    		else{
    			console.log('c is'+c);
    			if(c!=null){
    			var foundc=c;
    			db.getCollection({charity_id: c._id},db.Transaction, function(er,transs){
    				if(er){
    					console.log(er);
    				}
    				else{
    					var ttt=transs;
    					console.log('ok '+ttt);
    						res.render('admin', { title   : 'Admin', layout:'adminmain', findcharity:foundc, fff:ttt,
                           message : message ,
 							translist:translist,
                      		list: list});
    				}



    			});
    		}
    		else{
    			//req.flash('userhome','You are not Admin')
    			req.flash('admin','Found Nothing about "'+ charity+'"');
	res.redirect('/admin/admin');
    		}


    		}
    	});
				/////////////////////////////
				 // res.render('admin', { title   : 'Admin', layout:'adminmain',
     //                      message : message ,
 				// 			translist:translist,
     //                  		list: list});
				 ////////////////////////////////////
			}
		});

	}
});

}
else{
	req.flash('userhome','You are not Admin')
	res.redirect('/user/home');
}
  }
  else {
    // Grab any messages being sent to us from redirect:
    req.flash('login', 'You are not logged in')
    res.redirect('/user/login');
  }


      ////////////


    }

});

router.post('/finduser', (req, res) =>{
    var user = req.session.user;
    var username = req.body.username;

    if(!username){
      console.log("missing input");
      //req.flash('profile','Missing input!!!');
    res.redirect('/admin/admin');
    }
    else{
      //console.log('user id is: '+user._id);
if (user && online[user.name]) {
    if((user.admin)){
    var message = req.flash('admin') || '';

	db.getCollection({},db.User,function(err,users){
	if(err){
		console.log('error')
	}
	else{
		var list={};
		users.forEach(function(user){
			list[user._id]=user;
			// console.log(user);
		});
		//console.log(list);
		db.getCollection({},db.Transaction,function(error,trans){
			if(error){

			}
			else{
				var translist={};
				trans.forEach(function(tr){
					translist[tr._id]=tr;
				});
db.getObject({name:username},db.User, function(error, u){
    		if(error){
    			console.log(error);
    		}
    		else{
    			console.log('u is'+u);
    			if(u!=null){
    			var foundu=u;
    			db.getCollection({user_id: u._id},db.Transaction, function(er,transs){
    				if(er){
    					console.log(er);
    				}
    				else{
    					var uuu=transs;
    					console.log('ok '+uuu);
    						res.render('admin', { title   : 'Admin', layout:'adminmain',finduser:foundu,hhh:uuu,
                           message : message ,
 							translist:translist,
                      		list: list});
    				}



    			});
    		}
    		else{
    			//req.flash('userhome','You are not Admin')
    			req.flash('admin','Found Nothing about "'+ username+'"');
	res.redirect('/admin/admin');
    		}


    		}
    	});

			}
		});

	}
});

}
else{
	req.flash('userhome','You are not Admin')
	res.redirect('/user/home');
}
  }
  else {
    // Grab any messages being sent to us from redirect:
    req.flash('login', 'You are not logged in')
    res.redirect('/user/login');
  }

    }

});

router.post('/finduserbyid', (req, res) =>{
    var user = req.session.user;
    var username = req.body.username;

    if(!username){
      console.log("missing input");
      //req.flash('profile','Missing input!!!');
    res.redirect('/admin/admin');
    }
    else{
    	var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
      if(checkForHexRegExp.test(username)==false){
      	 console.log("invalid input");
      //req.flash('profile','Missing input!!!');
      req.flash('admin','Invalid Input "'+ username+'"');
    res.redirect('/admin/admin');
      }
if (user && online[user.name]) {
    if((user.admin)){
    var message = req.flash('admin') || '';

	db.getCollection({},db.User,function(err,users){
	if(err){
		console.log('error')
	}
	else{
		var list={};
		users.forEach(function(user){
			list[user._id]=user;
			// console.log(user);
		});
		//console.log(list);
		db.getCollection({},db.Transaction,function(error,trans){
			if(error){

			}
			else{
				var translist={};
				trans.forEach(function(tr){
					translist[tr._id]=tr;
				});
db.getObject({_id:username},db.User, function(error, u){
    		if(error){
    			console.log(error);
    		}
    		else{
    			console.log('u is'+u);
    			if(u!=null){
    			var foundu=u;
    			db.getCollection({user_id: u._id},db.Transaction, function(er,transs){
    				if(er){
    					console.log(er);
    				}
    				else{
    					var uuu=transs;
    					console.log('ok '+uuu);
    						res.render('admin', { title   : 'Admin', layout:'adminmain',finduser:foundu,hhh:uuu,
                           message : message ,
 							translist:translist,
                      		list: list});
    				}



    			});
    		}
    		else{
    			//req.flash('userhome','You are not Admin')
    			req.flash('admin','Found Nothing about "'+ username+'"');
	res.redirect('/admin/admin');
    		}


    		}
    	});

			}
		});

	}
});

}
else{
	req.flash('userhome','You are not Admin')
	res.redirect('/user/home');
}
  }
  else {
    // Grab any messages being sent to us from redirect:
    req.flash('login', 'You are not logged in')
    res.redirect('/user/login');
  }

    }

});

module.exports = router;
