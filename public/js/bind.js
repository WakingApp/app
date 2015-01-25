(function() {

	var socket = io();
	var has_alarm = false;
	var set = document.getElementById('start');
	set.addEventListener('click', function() {
		console.log('click');
		var view = document.querySelector('.main-view'); 
		var at = {};
		var qs = document.querySelectorAll('select.digits');
		for(var i = 0; i < qs.length; i++) {
			var id = qs[i].id;
			console.log(id + ':' + qs[i].value)
			at[id] = qs[i].value;
			document.querySelector('h1.digits.' + id).innerHTML = qs[i].value;
		}
		var ts = document.querySelector('select.time-select');
		document.querySelector('h3.time-select').innerHTML = ts.value;
		var msg = {};

		msg.alarmTime = at.hours + ':' + at.minutes; 		
		msg.timeRange = ts.value;
		addEvent('Set alarm time to ' + at.hours + ':' + at.minutes + ' with a window of ' + ts.value + ' minutes');	
		console.log(msg);
		socket.emit('settings', msg);		
		function setAlarm(){
			view.classList.remove('clock');
			view.classList.add('set');	
			var al = document.querySelector('.alert');
			if(al) {
				al.remove();
			}
		}	
		var to = setTimeout(setAlarm , 2000);
		socket.on('warning', function(eventobj) {
			clearTimeout(to);
			createPopup('Are you sure?', eventobj.name + ' is at ' + eventobj.time + '!', 'Cancel', 'OK', function() { ; }, setAlarm);
		});
	});

	document.getElementById('alarm').addEventListener('click', function() {
		var view = document.querySelector('.main-view'); 
		view.classList.remove('history');
		view.classList.remove('settings');
		view.classList.add('alarm');

		resetButtons();

		this.classList.add('active');
	});
	
	document.getElementById('history').addEventListener('click', function() {
		var view = document.querySelector('.main-view'); 
		view.classList.add('history');
		view.classList.remove('settings');
		view.classList.remove('alarm');

		resetButtons();
		this.classList.add('active');
	});

	document.getElementById('settings').addEventListener('click', function() {
		var view = document.querySelector('.main-view'); 
		view.classList.remove('history');
		view.classList.add('settings');
		view.classList.remove('alarm');
		
		resetButtons();	
		this.classList.add('active');
	});

	function resetButtons() {
		var buttons = document.querySelectorAll('.tab-item');
		for(var i = 0; i < buttons.length; i++) {
			buttons[i].classList.remove('active');
		}
	}

	var buttons =	document.getElementsByClassName('settings-button-minus');
	for(var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', function() {
			this.parentNode.remove();
		});
	}

	function addEvent(stringevent) {
		var li = document.createElement('li');	
		li.classList.add('events-item');
		li.innerHTML = stringevent;
		document.querySelector('.events-list').appendChild(li);	
	}

	function createPopup(title, text, txt_left, txt_right, fn_left, fn_right) {
	
		var alt = document.createElement('div');
		alt.classList.add('alert');
		var row = document.createElement('div');
		row.classList.add('alert-row');
		var cancel_btn = document.createElement('div');
		cancel_btn.innerHTML = txt_left;
		cancel_btn.classList.add('alert-button');
		cancel_btn.classList.add('alert-cancel');

		cancel_btn.addEventListener('click', function() {
			this.parentNode.parentNode.remove();
			fn_left();
		});

		var ok_btn = document.createElement('div');
		ok_btn.innerHTML = txt_right;
		ok_btn.classList.add('alert-button');
		ok_btn.classList.add('alert-ok');

		ok_btn.addEventListener('click', function() {
			this.parentNode.parentNode.remove();
			fn_right();
		});
		
		var p_alert = document.createElement('p');
		p_alert.innerHTML = text;
		p_alert.classList.add('alert-text');
		var h_alert = document.createElement('h3');
		h_alert.innerHTML = title;
	
		alt.appendChild(h_alert);
		alt.appendChild(p_alert);
		
		row.appendChild(cancel_btn);			
		row.appendChild(ok_btn);
		alt.appendChild(row);		
		
		document.querySelector('.main-view').appendChild(alt);
	}

		socket.on('settings', function(json) {
			var time_arr = json.alarmTime.split(':');
			var hours = time_arr[0];
			if(!hours || !minutes) {
				return;
			}
			var minutes = time_arr[1];			
			document.querySelector('h1.hours').innerHTML = hours;
			document.querySelector('h1.minutes').innerHTML = minutes;
			document.querySelector('h3.time-select').innerHTML = json.timeRange;
			addEvent('Set alarm time to ' + hours + ':' + minutes + ' with a window of ' + json.timeRange + ' minutes');	
		});

		socket.on('alarm', function(alarmMessage) {
			
			if(has_alarm) {
				return;
			}

			has_alarm = true;

			var snooze5 = function () { snooze(5); }
			var snooze15 = function () { snooze(15); }

			createPopup('Good morning!', 'Want to keep snoozing?','5 mins', '15 mins', snooze5, snooze15); 
			addEvent(alarmMessage);	
		});

		socket.on('stop alarm', function() {
			console.log('stop alarm');
			document.querySelector('.alert').remove();
			document.querySelector('.main-view').classList.add('clock');
			document.querySelector('.main-view').classList.remove('set');
		});

		socket.on('showerOn', function(json) {
				
			addEvent('Shower is occupied');			
		});

		socket.on('showerOff', function(json) {
				
			addEvent('Shower is free');			
		});

		function sendSettings(alarmTime, timeRange) {
			socket.emit('settings', {
				alarmTime: alarmTime,
				timeRange: timeRange
			});
		}

		function snooze(minutes) {
			has_alarm = false;
			addEvent('Pressed snooze for ' + minutes + ' minutes'); 
			socket.emit('snooze',minutes);
		}
})();
