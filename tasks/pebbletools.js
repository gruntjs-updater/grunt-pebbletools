var bundle = require('./lib/bundle');
var extract = require('./lib/extract');
var deploy = require('./lib/deploy');
var setup = require('./lib/setup');
var compile = require('./lib/compile');
var prettyData = require('./lib/prettyData');
var conversion = require('./lib/conversion');

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('pebbletools', 'tools for pebble applications', function(param1) {

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
      done();

  });

};
