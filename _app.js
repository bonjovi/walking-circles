var app = require('express')();
var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var http = require('http').Server(app);

var io = require('socket.io')(2001);

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'hbs');

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.render('system', {layout: false});
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        socket.emit('chat message', msg);
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});