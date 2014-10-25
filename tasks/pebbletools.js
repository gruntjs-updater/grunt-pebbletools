var bundle = require('./lib/bundle');
var extract = require('./lib/extract');
var deploy = require('./lib/deploy');
var setup = require('./lib/setup');
var compile = require('./lib/compile');
var concat = require('./lib/concat');
var prettyData = require('./lib/prettyData');
var conversion = require('./lib/conversion');

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('pebbletools', 'tools for pebble applications', function(param1) {
    //// Merge task-specific and/or target-specific options with these defaults.
    //var options = this.options({
      //punctuation: '.',
      //separator: ', '
    //});

    //// Iterate over all specified file groups.
    //this.files.forEach(function(f) {
      //// Concat specified files.
      //var src = f.src.filter(function(filepath) {
        //// Warn on and remove invalid source files (if nonull was set).
        //if (!grunt.file.exists(filepath)) {
          //grunt.log.warn('Source file "' + filepath + '" not found.');
          //return false;
        //} else {
          //return true;
        //}
      //}).map(function(filepath) {
        //// Read file source.
        //return grunt.file.read(filepath);
      //}).join(grunt.util.normalizelf(options.separator));

      //// Handle options.
      //src += options.punctuation;

      //// Write the destination file.
      //grunt.file.write(f.dest, src);

      //// Print a success message.
      //grunt.log.writeln('File "' + f.dest + '" created.');
    //});

    var done = this.async();
    grunt.log.writeln('STARTING ...');
    grunt.log.writeln('');
    switch (this.target) {

				case 'bundle':
					bundle(grunt, this.data);
					break;
				case 'extract':
					extract(grunt, this.data);
					break;
				case 'deploy':
					deploy(grunt, this.data, param1);
					break;
				case 'setup':
					setup(grunt, this.data, param1);
					break;
				case 'concat':
					concat(grunt, this.data);
					break;
				case 'compile':
					compile(function() { done(true) }, grunt, this.data, param1);
					break;
				case 'json2xml':
					conversion.json2xml(grunt, this.data);
					break;
				case 'xml2json':
					conversion.xml2json(grunt, this.data);
					break;
				case 'prettify':
					prettyData.prettify(grunt, this.data);
					break;
				case 'minify':
					prettyData.minify(grunt, this.data);
					break;
				case 'changeSpec':
					changeSpec(grunt, this.data);
					break;
			}
      grunt.log.writeln('');
      grunt.log.writeln('DONE.');

  });

};
