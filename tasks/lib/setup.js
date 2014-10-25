
var fs = require('fs');
var p = require('path');

var topDir = process.cwd();


'use strict';

function setupKarma(grunt, data, accessPointParam) {
  var karmaDir = data.karmaDir || 'karma';
  grunt.file.copy(p.join(__dirname, 'setup', 'karma', 'bower.json'), p.join(topDir, karmaDir, 'bower.json'));
  grunt.file.copy(p.join(__dirname, 'setup', 'karma', '_testEnv.js'), p.join(topDir, karmaDir, '_testEnv.js'));
}

function setupAutomation(grunt, data, accessPointParam) {
  var automationDir = data.automationDir || 'automation';
  grunt.file.copy(p.join(__dirname, 'setup', 'automation', 'chromedriver'), p.join(topDir, automationDir, 'chromedriver'));
  grunt.file.copy(p.join(__dirname, 'setup', 'automation', 'selenium-server-standalone-2.42.0.jar'), p.join(topDir, automationDir, 'selenium-server-standalone-2.42.0.jar'));
  grunt.file.copy(p.join(__dirname, 'setup', 'automation', 'getRemoteControl.js'), p.join(topDir, automationDir, 'getRemoteControl.js'));
  grunt.file.copy(p.join(__dirname, 'setup', 'automation', 'mocha-test.js'), p.join(topDir, automationDir, 'mocha-test.js'));
  grunt.file.copy(p.join(__dirname, 'setup', 'automation', 'sample.spec.js'), p.join(topDir, automationDir, 'sample.spec.js'));
}

module.exports = function(gruntRef, data, param1) {
  grunt = gruntRef;
  setupKarma(grunt, data, param1);
  setupAutomation(grunt, data, param1);

};
