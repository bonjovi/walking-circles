var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
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





var mongoose = require('mongoose');
var nodemailer = require('nodemailer');

mongoose.connect('mongodb://localhost/nodeauth');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();
var server = app.listen(2000);

var newApp = require('express')();

var querystring = require('querystring');
var urlH = require('url');


// Socket
var http = require('http').Server(app);
var httpSocket = require('http').Server(newApp);
var httpH = require('http');

//При клике на body вызывается аяксом эта функция
httpH.createServer(function (req, res) {
    var pquery = querystring.parse(urlH.parse(req.url).query);
    var callback = (pquery.callback ? pquery.callback : '');

    var returnObject = {message: pquery};
    var returnObjectString = JSON.stringify(returnObject);

    console.log('request received');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(callback + '(\'' + returnObjectString + '\')');

    if(pquery.x) {
        MongoClient.connect(url, function(err, db) {
            var dbo = db.db("nodeauth");
            dbo.collection("users").findOneAndUpdate(
                    {name: pquery.username}, // критерий выборки
                    { $set: {x: pquery.x, y: pquery.y}}, // параметр обновления
                    function(err, result){
                         
                        console.log(result);
                        db.close();
                    }
            );
        });
    }

    if(pquery.userinfo) {
        MongoClient.connect(url, function(err, db) {
            var dbo = db.db("nodeauth");
            dbo.collection("users").findOneAndUpdate(
                    {name: pquery.username}, // критерий выборки
                    { $set: {userinfo: pquery.userinfo}}, // параметр обновления
                    function(err, result){
                         
                        console.log(result);
                        db.close();
                    }
            );
        });
    }

    if(pquery.userabout) {
        MongoClient.connect(url, function(err, db) {
            var dbo = db.db("nodeauth");
            dbo.collection("users").findOneAndUpdate(
                    {name: pquery.username}, // критерий выборки
                    { $set: {userabout: pquery.userabout}}, // параметр обновления
                    function(err, result){
                         
                        console.log(result);
                        db.close();
                    }
            );
        });
    }

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

}).listen(8124);





//var io = require('socket.io')(http);

// io.on('connection', function(socket){
//     socket.on('moving', function(cx, cy){
//         console.log(cx, cy);
//         io.emit('moving', cx, cy);
//     });
// });

// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });

// var io = require('socket.io')(6001);

// io.on('connection', function(socket) {
//     console.log('New connection', socket.id);
//     //socket.send("Message from server");

//     socket.on('message', function(data) {
//         socket.send(data);
//     });
//     //socket.emit('news', { hello: 'world' });
// })

// http.listen(4000, function(){
//   console.log('listening on *:4000');
//   console.log('Satana');
// });

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'hbs');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'kalash',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



var io = require('socket.io').listen(2001);

io.on('connection', function(socket){
    socket.on('chat message', function(movingEmail, movingX, movingY){
        console.log('message: ' + movingEmail + ' ' + movingX + ' ' + movingY);
        io.emit('chat message', movingEmail, movingX, movingY);
    });

});







app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
    console.log('Сервер запущен. Используемый порт: '+app.get('port'));
});


