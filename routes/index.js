var express = require('express');
var exphbs = require('express-handlebars');
var router = express.Router();
var app = express();

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	
	res.render('system', {layout: false, username: req.user.username});
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