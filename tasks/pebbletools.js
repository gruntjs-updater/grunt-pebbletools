/*
 * grunt-pebble
 * 
 *
 * Copyright (c) 2014 rtsunoda
 * Licensed under the MIT license.
 */

var compress = require('./lib/compress');
var extract = require('./lib/extract');
var deploy = require('./lib/deploy');
'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('pebbletools', 'compress and extract your apps', function(param1) {
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

			switch (this.target) {

				case 'compress':
					grunt.log.writeln('STARTING COMPRESS ...');
					grunt.log.writeln('');
					compress(grunt, this.data);
					grunt.log.writeln('');
					grunt.log.writeln('DONE.');
					break;
				case 'extract':
					grunt.log.writeln('STARTING EXTRACT ...');
					grunt.log.writeln('');
					extract(grunt, this.data);
					grunt.log.writeln('');
					grunt.log.writeln('DONE.');
					break;
				case 'deploy':
					grunt.log.writeln('STARTING DEPLOY ...');
					grunt.log.writeln('');
					deploy(grunt, this.data, param1);
					grunt.log.writeln('');
					grunt.log.writeln('DONE.');
					break;
			}

  });

};
