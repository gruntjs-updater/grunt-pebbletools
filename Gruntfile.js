/*
 * grunt-pebbletools
 * 
 *
 * Copyright (c) 2014 rtsunoda
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      tests: ['frontend', 'server', 'theInstance.xml', 'standard_bundle.json', 'pebble.json',
      'config', 'views', 'appstack_bundle.json', 'config.json']
    },

    // Configuration to be run (and then tested).
    pebbletools: {
      extractPebble:{
        appPath: 'test/fixtures/standard.json'
      },
      bundlePebble: {
        outputFile: 'standard_bundle.json',
        ignore: []
      },
      buildStatic: {
        configsPath: 'config',
        viewsPath: 'views',
        outputPath: 'output'
      },
      json2xml: {
        input: 'standard_bundle.json',
        output: 'standard_bundle.xml'
      },
      xml2json: {
        input: 'standard_bundle.xml',
        output: 'standard_bundle.json'
      }
    },
    // Unit tests.
    nodeunit: {
      testPebbleBundle: [
        'test/bundle_pebble_test.js'
      ],
      testPebbleExtract: [
        'test/extract_pebble_test.js', 
      ],
      testOtherBundle: [
        'test/bundle_test.js', 
      ],
      testOtherExtract: [
        'test/extract_test.js', 
      ]
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['testPebbleExtract', 'testPebbleBundle']);
  grunt.registerTask('testPebbleExtract', ['clean', 'pebbletools:extractPebble', 'nodeunit:testPebbleExtract']);
  grunt.registerTask('testPebbleBundle', ['pebbletools:bundlePebble', 'nodeunit:testPebbleBundle']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
