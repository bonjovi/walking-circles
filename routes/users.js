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



var fs = require("fs");
		var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost/nodeauth";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("nodeauth");
  dbo.collection("users").find({}).toArray(function(err, result) {
    if (err) throw err;
    fs.unlinkSync('public/hello.tsv');
    fs.appendFileSync('public/hello.tsv', 'x' + '\t' + 'y' + '\t' + 'name' + '\t' + 'email' + '\n');
    for (key in result) {
        console.log(result[key].name);
        fs.appendFileSync('public/hello.tsv', result[key].x + '\t' + result[key].y + '\t' + result[key].name + '\t' + result[key].email + '\n');
        // fs.writeFile("hello.tsv", "Hello мир!", function(error){
        //     if(error) throw error; 
        //     console.log("Асинхронная запись файла завершена. Содержимое файла:");
        //     var data = fs.readFileSync("hello.txt", "utf8");
        //     console.log(data);  
        // });
    }
    db.close();
  });
});

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