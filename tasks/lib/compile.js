var fs = require('fs');
var p = require('path');
var exec = require("child_process").exec;
var getFullPaths = require('./getFullPaths');

var topDir = process.cwd();

'use strict';

module.exports = function(cb, gruntRef, data) {
  grunt = gruntRef;
  var s = fs.readFileSync(data.configPath);
  if (!s) {

    console.log("config.json doesn't exists");
    cb(false);

  } else {

    var elements = data.configPath.split('/');
    elements.pop();
    var projectDir = elements.join('/');
    var config = JSON.parse(s.toString());

    //compile -----
    var execStr = "java -jar " + p.join(__dirname, "compile", "compiler.jar") + " --js_output_file " + data.outputFile;

    execStr += " --warning_level VERBOSE";
    execStr += " --externs " + p.join(projectDir, "externs.js");

    //source files
    var filePaths = getFullPaths(projectDir, config);
    for (var i = 0; i < filePaths.length; i++) {
      var file = filePaths[i];
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

  }
};



