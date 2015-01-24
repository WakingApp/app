var express = require('express')
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
    res.sendfile('index.html');
});

io.emit('settings', {alarmTime: "", timeRange:"0" });

app.get('/test', function(req, res){
    res.sendFile(__dirname + '/ui/application.html')
});

app.use(express.static((__dirname + '/ui')));


var ws = require('./ws')

ws.ws(io)

console.log("Alarm Time: " + ws.alarmTime)
console.log("Time Range: " + ws.timeRange)

http.listen(3000, function(){
    console.log('listening on *:3000');
});