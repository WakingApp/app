module.exports = function() {

    var request = require('request');

    function id(obj) { return obj; }

    function getBoardList(user, secret, fn) {
        request.get({
            url: 'https://cloud.smartables.io/api/info/' + user + '/list',
            headers: {
                'X-APISecret': secret
            },
            json: true,
            strictSSL: false
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body.boards) // Returns an array with all boards associated to the user's account.
                fn(body.boards);
            }
        });
    }

    function getDataFromSensor(user, board, port, is_act, secret, fn) {
        var sensor_type = is_act ? 'ACT' : 'SENSE';
        request.get({
            url: 'https://cloud.smartables.io/api/read/' + user  + '/' + board + '/' + sensor_type + '/' + port,
            headers: {
                'X-APISecret': secret
            },
            json: true,
            strictSSL: false
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
//                console.log(body) // Returns an object with last data from device.
                fn(body);
            }
        });
    }

    function pushDataToSensor(user, board, port, secret, is_act, content, fn) {
        var sensor_type = is_act ? 'ACT' : 'SENSE';
        request.put({
            url: 'https://cloud.smartables.io/api/write/' + user + '/' + board + '/ACT/' + port,
            headers: {
                'X-APISecret': secret
            },
            json: true,
            strictSSL: false,
            body: content
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body.message) // Returns the result's message.
                fn(body.message);
            }
        });
    };

    
    var module = {};

    module.getBoardList = getBoardList;
    module.getDataFromSensor = getDataFromSensor;
    module.pushDataToSensor = pushDataToSensor;

    return module;

}
