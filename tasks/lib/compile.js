var fs = require('fs');
var p = require('path');
var exec = require("child_process").exec;

var topDir = process.cwd();

'use strict';

module.exports = function(cb, gruntRef, data) {
  grunt = gruntRef;

  //compile -----
  var execStr = "java -jar " + p.join(__dirname, "compile", "compiler.jar") + " --js_output_file " + data.outputFile;

  execStr += " --warning_level VERBOSE";
  execStr += " --externs " + data.externsFile;

  //source files
  for (var i = 0; i < data.options.files.length; i++) {
    var file = data.options.files[i];
    execStr += " --js " + file;
  }

  execStr += " --compilation_level SIMPLE_OPTIMIZATIONS";// WHITESPACE_ONLY; 
  //execStr += " --manage_closure_dependencies true"; 

  //compile
  var childProc = exec(execStr, function (error, stdout, stderr) {

    if (stderr.indexOf('\n0 error(s)') !== -1) {
      grunt.log.writeln('stderr: ' + stderr);
      cb(true);
    } else {
      grunt.fail.warn(stderr);
      cb(false);
    }
  });

};



