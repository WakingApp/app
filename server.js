var express = require('express')
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var showerOccupiedAlertSent = false;
var showerFreeAlertSent = false;

app.get('/', function(req, res){
    res.sendfile('index.html');
});

io.emit('settings', {alarmTime: "", timeRange:"0" });

app.get('/test', function(req, res){
    res.sendFile(__dirname + '/ui/application.html')
});

app.use(express.static((__dirname + '/ui')));

var iotEventDispatcher = require('./iotEventDispatcher')(io)

var ws = require('./ws')(io, iotEventDispatcher)

setInterval(function(){
    var currentTime = new Date().getTime();
    if(Math.abs(currentTime - ws.alarmTimeFormatted) < 30 * 60 * 1000){
        var nearEvent = ws.getNearEvents(ws.alarmTimeFormatted)
        if(iotEventDispatcher.isShowerOccupied && !showerOccupiedAlertSent){
            io.emit('showerOccupied', "");
            showerOccupiedAlertSent = true
        }else if(!iotEventDispatcher.isShowerOccupied && !showerFreeAlertSent){
            var timeLapsed = currentTime - ws.alarmTimeFormatted
            console.log("timeLapsed " + timeLapsed)
            if(timeLapsed > 0) {
                io.emit('showerFree', "");
                io.emit('alarm', true);
                showerFreeAlertSent = true
                //ws.alarmFired = true
            }

        }
    }
}, 1000)

http.listen(3000, function(){
    var shower = require('./lib/shower')(iotEventDispatcher.showerOn.bind(this), iotEventDispatcher.showerOff.bind(this));
    shower();
    console.log('listening on *:3000');
});