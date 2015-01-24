var sensors = require("./sensors.js")();

var board = "ERGQ6GZIXM";
var user = "9DYM2ibZRA";
var secret = "oDvfU7qCr4";

var body = {dig: 0};

sensors.pushDataToSensor(user, board, 1, secret, true, body, function(data) {
	console.log(data);
});
