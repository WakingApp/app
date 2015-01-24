module.exports = function() {
	
	var _ = require('underscore');
	var sensor_lib = require('./sensors');
	var board = {};
	var sensors = [];
	var data = [];

	function addBoard(user,board_id, secret) {
		board.user = user;
		board.id = id;
		board.secret = secret;
	}

	function addSensor(type, port, is_act, key,  analysis_fn){
		var sensor = {
			type: type,
			port: port,
			is_act: is_act,
			key: key,
			analysis: analysis_fn
		};
		sensors[port] = sensor;
	}

	function pollSensor(port){
		function addData(data){
			data[port].push({
				value: data[sensors[data].key],
				time: new Date().value 
			});
		}
		sensor_lib.getDataFromSensor(board.user, board.id, port, board.secret, getData);
	}	

	function startPoll() {
		_.each(sensors, function(elem, index, list) {
			setInterval(pollSensor.bind(), 2000, index); 
		});
	}	

	function start() {
		addBoard('5LBlnOuWl8','60O7UZ1OKI' ,'lIRD9fE4CE');
		addSensor('temperature', 2, false, 'temp', console.log);
		startPoll();
	}

	return start;
}
