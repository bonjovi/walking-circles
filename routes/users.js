var express = require('express');
var router = express.Router();
var passport = require('passport');
var nodemailer = require('nodemailer');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

var gmail = require('../config/gmail');



// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Введите имя').notEmpty();
	req.checkBody('email', 'Введите email').notEmpty();
	req.checkBody('email', 'Введите корректный email').isEmail();
	req.checkBody('username', 'Введите логин').notEmpty();
	req.checkBody('password', 'Введите пароль').notEmpty();
	req.checkBody('password2', 'Пароли не совпадают').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'Вы зарегистрированы и можете войти в систему');

		// Sending email
		nodemailer.createTestAccount((err, account) => {
		    var transporter = nodemailer.createTransport({
		        host: 'smtp.gmail.com',
		        port: 465,
		        secure: true, 
		        auth: {
		            user: gmail.gmailLogin, 
		            pass: gmail.gmailPassword  
		        }
		    });

		    var userMailOptions = {
		        from: '"Nooclub Ghost 👻" <ghost@nooclub.com>', 
		        to: email, 
		        subject: name + ', Вы были успешно зарегистрированы в Nooclub!', 
		        //text: 'Hello world?', 
		        html: '<p>Поздравляем, ' + name + '! Вы были успешно зарегистрированы в Nooclub.</p><p>Ваш логин: ' + username + '</p><p>Ваш пароль: ' + password + '</p>' 
		    };

		    transporter.sendMail(userMailOptions, (error, info) => {
		        if (error) {
		            return console.log(error);
		        }
		        console.log('Message sent: %s', info.messageId);
		        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

		    });
		});
		// End of sending email

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Пользователь не найден'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Неправильный пароль'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/' + req.user.username);
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'Вы вышли из системы');

	res.redirect('/users/login');
});

module.exports = router;