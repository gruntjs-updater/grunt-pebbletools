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
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    pebbletools: {
      extract:{
        isPebbleProject: true,
        projectPath: 'tmp',
        appPath: 'test/fixtures/standard.json'
      },
      bundle: {
        isPebbleProject: true,
        outputFile : 'tmp/standard_bundle.json',
        projectPath: 'tmp'
      },
    },
    // Unit tests.
    nodeunit: {
      tests: [
        'test/extract_test.js', 
        'test/bundle_test.js'
      ]
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['clean', 'pebbletools:extract', 'pebbletools:bundle', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
