

module.exports = function(io){
    io.on('connection', function(socket){
        socket.on('alarmInfo', function(msg){
            //io.emit('chat message', msg);
            console.log('The message: ' +  msg)
        });
    });
}
