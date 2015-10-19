var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var user_array = [];

io.on('connection', function(socket){
    socket.on('set username', function(username) {
        socket.username = username;
        user_array.push(username);
        io.emit('user list', user_array);
        socket.broadcast.emit('status', username + ' has connected');
    });
    socket.on('disconnect', function(){
        user_array.splice(user_array.indexOf(socket.username), 1);
        io.emit('user list', user_array);
        io.emit('status', socket.username + ' has disconnected');
    });
    socket.on('chat message', function(msg){
        io.emit('chat message', socket.username + ': ' + msg);
    });
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
