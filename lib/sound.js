module.exports  = function(){

var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');

fs.createReadStream('./sound.mp3')
  .pipe(new lame.Decoder)
  .on('format', console.log)
  .pipe(new Speaker);
}
