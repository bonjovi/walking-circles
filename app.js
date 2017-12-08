var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var hbs = require('express-handlebars');
var bodyParser  = require('body-parser');
var validator = require('express-validator');
var session = require('express-session');

//var db = require('./db.js');

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/nodeauth');

// var UserSchema = mongoose.Schema({
// 	   username: String,
// 	   password: String
// });

// var User = mongoose.model('User', UserSchema);

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(validator());

app.use(express.static(path.join(__dirname, 'public')));

/*var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:12648/nodeauth', function(err, db) {
	if(err) {
		throw err;
	}

	db.collection('users').find().toArray(function(err, result) {
		if(err) {
			throw err;
		}
		console.log(result);
	});
});*/

app.set('trust proxy', 1) // trust first proxy
app.use(session({
	secret: 'kalash'
}))







app.use(function (req, res, next) {
    if(req.url == '/register') {
        res.render('register.hbs', {
            title: 'Регистрация'
        });        
    } else {
        next();
    }
});

app.use(function (req, res, next) {
    if(req.url == '/login') {
        res.render('login.hbs', {
            title: 'Вход'
        });        
    } else {
        next();
    }
});

app.use(function (req, res, next) {
    if(req.url == '/confirm') {
        res.render('confirm.hbs', {
            title: 'Подтверждение регистрации'
        });        
    } else {
        next();
    }
});




















app.use(function (req, res, next) {
    if(req.url == '/numbers') {
    	if(!req.session.numberOfVisits) {
    		req.session.numberOfVisits = 1;
    		//res.status(201).send(req.session);
    	} else {
    		req.session.numberOfVisits += 1;
    		//res.status(200).send(req.session);
    	}
		res.render('number.hbs', {
			number: 111
		});
		//res.send(req.session);		
    } else {
    	next();
    }
});

app.use(function (req, res, next) {
    if(req.url == '/userinfo') {
    	var selectedUser = User.findOne({'_id': '59a0136112712b63184c4150'}, (err, user) => {
		    //console.log('result', err, user);
		    //console.log(user);
		    userinfo(user);
		});

    	//console.log(typeof selectedUser);
    	function userinfo(user) {
    		res.render("userinfo.hbs", {
		        title: "Информация о пользователе",
		        emailsVisible: true,
		        emails: ['nonerased@mail.ru', 'roman-kalashnikoff@yandex.ru'],
		        phone: "+7 926 871 9670",
		        users: user.username
		    });
    	}
        
    } else {
    	next();
    }
});

app.use(function (req, res, next) {
	if(req.url == '/error') {
  		throw 'Ошибка';
    } else {
    	next();
    }
});

app.use(function (req, res) {
	res.send('<h1>Index page<h1>');
});

app.listen(3000);