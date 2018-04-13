var express = require('express');
var exphbs = require('express-handlebars');
var router = express.Router();
var app = express();



// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	var userinfo;
	req.user.userinfo ? userinfo = req : userinfo = req

	var userabout;
	req.user.userinfo ? userabout = req : userabout = req

	res.render('system', {layout: false, userinfo: req.user.userinfo, userabout: req.user.userabout, username: req.user.name, email: req.user.email.replace('@', '').replace('_', '').replace('.', '')});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;