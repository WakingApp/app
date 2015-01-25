module.exports = function(io, iotEventDispatcher){
    var eventLog = []
    var ioSocket
    var mod = {alarmTime: '', timeRange: 0, alarmTimeout: '', alarmFired: false, amountOfTimeExtended: 0};
    var triggers = require('./lib/trigger')()

    io.on('connection', function(socket){
        ioSocket = socket

        io.emit('settings', {alarmTime: mod.alarmTime, timeRange: mod.timeRange });
        socket.on('settings', function(msg){
            mod.alarmTime = msg.alarmTime
            mod.timeRange = msg.timeRange
            console.log("timeRange", mod.timeRange)
            var alarmTime = parseTime(mod.alarmTime).getTime()
            var nearEvent = mod.getNearEvents(alarmTime)
            if(nearEvent){
                console.log("warning sent:" + nearEvent.name)
                io.emit('warning', nearEvent);
            }else{
                console.log("normal time")
                mod.alarmTimeFormatted = parseTime(mod.alarmTime).getTime()
                alarmClock(mod.alarmTime)
            }

        });

        socket.on('alarmConfirmation', function(msg){
            var alarmTime = parseTime(mod.alarmTime).getTime()
            mod.alarmTimeFormatted = alarmTime
            alarmClock(mod.alarmTime)
        });

        socket.on('snooze', function(snoozeTime){
            console.log("USER SNOOZED")
            logEvent('snooze')
            triggers.body.dig = 0
            triggers.pushDataToSensor()
            setAlarmTime(snoozeTime * 60 * 1000)//converting to ms
        });
    });
    var sendSignal = function(){
        //if(!mod.alarmFired) {
            var nearEvent = mod.getNearEvents(mod.alarmTime)
            if (iotEventDispatcher.isShowerOccupied && (mod.timeRange > 0 && !nearEvent)) {
                var gracePeriod = 5 * 60 * 1000 //5 minutes
                mod.timeRange = Math.abs(mod.timeRange - gracePeriod);
                mod.setAlarmTime(gracePeriod)
                mod.amountOfTimeExtended = mod.amountOfTimeExtended + gracePeriod
                ioSocket.emit("actualAlarmTime", mod.alarmTimeFormatted + mod.amountOfTimeExtended)
            } else {
                ioSocket.emit('alarm', 'Alarm Rang')
                triggers.body.dig = 1
                triggers.pushDataToSensor()
                mod.alarmFired = true
            }
        //}
    }

    function alarmClock(time){
        var timeToWakeup = parseTime(time)

        var currentTime = new Date();

        if(timeToWakeup < currentTime){
            timeToWakeup.setDate(timeToWakeup.getDate() + 1);
        }
        var timeToWakeupInMs = timeToWakeup - currentTime
        console.log("setting the alarm " + timeToWakeupInMs)
        setAlarmTime(timeToWakeupInMs)
    }

    var setAlarmTime = function (value){
        mod.alarmTimeout = setTimeout(function(){sendSignal()}, value)
    }

    function logEvent(value){
        eventLog.push({type: value, time: new Date()});
    }

    function parseTime(time){
        var hour = time.split(":")[0]
        var minute = time.split(":")[1]
        var timeToWakeup = new Date()
        timeToWakeup.setHours(hour);
        timeToWakeup.setMinutes(minute);
        timeToWakeup.setSeconds(00);
        return timeToWakeup
    }

    var getNearEvents = function(alarmTime){
        var event = {name: 'Meeting with investor', time:'09:30'}
        if(parseTime(event.time).getTime() - alarmTime <= 30 * 60 * 1000){
            return event
        }
        return null
    }

    mod.setAlarmTime = setAlarmTime
    mod.getNearEvents = getNearEvents

    return mod;

}
