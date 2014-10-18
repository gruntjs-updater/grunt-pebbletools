/*
 * grunt-pebbletools
 * 
 *
 * Copyright (c) 2014 rtsunoda
 * Licensed under the MIT license.
 */

var fs = require('fs');
var p = require('path');

var topDir = process.cwd();


'use strict';

/**
 * usage:  grunt deploy:full:pebbleDev:pebbleDesktop
 */
function setupKarma(grunt, data, accessPointParam) {
  var karmaDir = data.karmaDir || 'karma';
  grunt.file.copy(p.join(__dirname, 'setup', 'bower.json'), p.join(topDir, karmaDir, 'bower.json'));
  grunt.file.copy(p.join(__dirname, 'setup', '_testEnv.js'), p.join(topDir, karmaDir, '_testEnv.js'));
}


module.exports = function(gruntRef, data, param1) {
  grunt = gruntRef;
  setupKarma(grunt, data, param1);

};
