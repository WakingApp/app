var express = require('express')
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var showerOccupiedAlertSent = false;
var showerFreeAlertSent = false;
var cons = require('consolidate');
app.engine('html', cons.nunjucks);
app.set('view engine', 'html');

app.get('/', function(req, res){
    res.sendfile('index.html');
});

io.emit('settings', {alarmTime: "00:00", timeRange:"0" });

app.get('/test', function(req, res){
    res.render('test');
});

app.use(express.static((__dirname + '/public')));

var iotEventDispatcher = require('./iotEventDispatcher')(io)

var ws = require('./ws')(io, iotEventDispatcher)

var triggers = require('./lib/trigger')(function() {
	io.emit('stop alarm');
});

setInterval(function(){
    triggers.getDataFromSensor()
}, 5000)


setInterval(function(){
    var currentTime = new Date().getTime();
    console.log("currentTime", currentTime)
    console.log("ws.alarmTimeFormatted", ws.alarmTimeFormatted)
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
                triggers.body.dig = 1
                triggers.pushDataToSensor()
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
