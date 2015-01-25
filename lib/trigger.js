module.exports = function(stop_callback) {

    var sensors = require("./sensors.js")();
    var board = "ERGQ6GZIXM";
    var user = "9DYM2ibZRA";
    var secret = "oDvfU7qCr4";


    var mod = {}
    mod.body = {dig: 0};

    function pushDataToSensor() {
        sensors.pushDataToSensor(user, board, 1, secret, true, mod.body, function (data) {
            console.log("pushed");
            console.log(data);

        });
    }

    function getDataFromSensor() {
        sensors.getDataFromSensor(user, board, 2, false, secret, function (data) {
            if(data.dig == 1){
                console.log("turn off")
                mod.body.dig = 0;
                pushDataToSensor();
		console.log(stop_callback);
		stop_callback();
            }
        });
    }

    mod.pushDataToSensor = pushDataToSensor
    mod.getDataFromSensor = getDataFromSensor

    return mod
}
