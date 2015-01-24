module.exports = function(showerOccupiedFn, showerFreeFn) {

	var analysis = require('./analysis')();
	var isShowerOn = false;
	
	function init() {
		var user_id = '5LBlnOuWl8';
		var board_id = '60O7UZ1OKI';
		var secret = 'lIRD9fE4CE';	
		analysis.addBoard(user_id, board_id, secret);
		analysis.addSensor('water',5, false, 'dig', checkForShower.bind(this)); 
		analysis.startPoll();
	}

	function checkForShower(data) {
		if(!data || data.length <= 2) {
			return;
		}

		var index = data.length - 1;

		if(!isShowerOn && checkSensor(data, index, 0)) {
			showerOccupiedFn();
			isShowerOn = true;
		}

		if(isShowerOn && checkSensor(data, index, 1)) {
			showerFreeFn();	
			isShowerOn = false;
		}
		
	}

	function checkSensor(data, index, value) {
		return data[index][1] === value;
	/*
		return data[index] === value &&
			data[index - 1] === value &&
			data[index - 2] === value;
	*/
	}

	return init;

}
