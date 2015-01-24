/**
 * Module dependencies
 */

var http = require('http'),
  path = require('path');

var app = require('./app')

/**
 * Start Server
 */

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

