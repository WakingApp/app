module.exports = function analyse() {
	
	var _ = require('underscore');
	var sensor_lib = require('./sensors')();
	var board = {};
	var sensors = [];
	var data = [];

	function addBoard(user, id, secret) {
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
			analyse: analysis_fn
		};
		sensors[port] = sensor;
		data[port] = [];
	}

	function pollSensor(port){
		function addData(json){
			console.log(json);
			if(!json || !sensors[port] || !sensors[port].key)
				return;
			data[port].push([
				Date.now(), 
				json[sensors[port].key],
			]);
			sensors[port].analyse(data[port]);
		}
		console.log('data: ');
		console.log(data);
		sensor_lib.getDataFromSensor(board.user, board.id, port, false, board.secret, addData.bind(this));
	}	

	function startPoll() {
		
		_.each(sensors, function(elem, index, list) {
			if(elem)
				setInterval(pollSensor.bind(this), 10000, index); 
		});
	}	

	function start() {
		console.log('hi');
		addBoard('5LBlnOuWl8','60O7UZ1OKI' ,'lIRD9fE4CE');
		addSensor('temperature', 6, false, 'temp', console.log);
		addSensor('water', 5, false, 'dig', console.log);
		startPoll();
	}

	var module = {};
	module.addBoard = addBoard;
	module.addSensor = addSensor;
	module.startPoll = startPoll;
	return module;
}

