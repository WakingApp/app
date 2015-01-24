var alarm = require('./ws')

module.exports = function(io){
    function showerOn(){
        io.emit('showerOn', "");
    }

    function showerOff(){
        io.emit('showerOff', "");
    }
}