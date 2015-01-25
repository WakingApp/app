var alarm = require('./ws')


module.exports = function(io){

    var mod = {isShowerOccupied: false}
    function showerOn(){
        //io.emit('showerOn', "");
        mod.isShowerOccupied = true
        console.log("SHOWER OCCUPIED")
    }

    function showerOff(){
        //io.emit('showerOff', "");
        mod.isShowerOccupied = false
        console.log("SHOWER FREE")
    }

    mod.showerOn = showerOn;
    mod.showerOff = showerOff;

    return mod;
}