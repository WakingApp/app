/**
 * Module dependencies
 */

  var express = require('express'),
    http = require('http'),
    path = require('path'),
    cons = require('consolidate');

  var app = module.exports = express();

  /**
   * Configuration
   */

  // all environments
  app.set('port', process.env.PORT || 3000);
  app.engine('html', cons.nunjucks);
  app.set('view engine', 'html');
  app.use(express.static(path.join(__dirname, 'public')));
  // app.use(app.router);

  app.get('/:name', function(req,res) {
    res.render(req.params.name);
  })

  app.get('/', function(req,res) {
    res.render('index');
  });
