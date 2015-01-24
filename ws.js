var alarmTime = '0'
var timeRange = 0
var eventLog = []
var ioSocket

module.exports = function(io){
    io.on('connection', function(socket){
        ioSocket = socket
        io.emit('settings', {alarmTime: alarmTime, timeRange:timeRange });
        socket.on('settings', function(msg){
            console.log("aaaaaaa" + msg)
            alarmTime = msg.alarmTime
            timeRange = msg.timeRange
            alarmClock(alarmTime)
        });
        socket.on('snooze', function(snoozeTime){
            console.log("USER SNOOZED")
            logEvent('snooze')
            console.log("Snooze time" + snoozeTime)
            setAlarmTime(snoozeTime * 60 * 1000)//converting to ms
        });
    });
}

var sendSignal = function(){
    console.log("ALAAARM")
    ioSocket.emit('alarm', 'alarmOn')
}


function alarmClock(time){
    var hour = time.split(":")[0]
    var minute = time.split(":")[1]
    var timeToWakeup = new Date()
    timeToWakeup.setHours(hour);
    timeToWakeup.setMinutes(minute);
    timeToWakeup.setSeconds(00);

    var currentTime = new Date();

    if(timeToWakeup < currentTime){
        timeToWakeup.setDate(timeToWakeup.getDate() + 1);
    }
    var timeToWakeupInMs = timeToWakeup - currentTime
    console.log("setting the alarm " + timeToWakeupInMs)
    setAlarmTime(timeToWakeupInMs)
}

exports.setAlarmTime = function setAlarmTime(value){
    setTimeout(function(){sendSignal()}, value)
}

function logEvent(value){
    eventLog.push({type: value, time: new Date()});
}