var alarmTime = '0'
var timeRange = 0

module.exports.ws = function(io){
    io.on('connection', function(socket){
        io.emit('settings', {alarmTime: alarmTime, timeRange:timeRange });
        socket.on('settings', function(msg){
            alarmTime = msg.alarmTime
            timeRange = msg.timeRange
            //console.log('Alarm time: ' +  alarmTime)
            //console.log('Time range: ' +  timeRange)
        });
        socket.on('alarmInfo', function(msg){
            console.log('The message: ' +  msg)
        });
    });
}

module.exports.alarmTime = alarmTime
module.exports.timeRange = timeRange
