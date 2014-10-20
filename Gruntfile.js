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

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    pebbletools: {
      extract:{},
      compress: {
        outputFile : 'test.json',
        configPath : 'theInstance.xml',
        clientFiles: [
          'pebble-object/**/*.js', 
          'pebble-shared/**/*.js', 
          'pebble-client/src/*.js', 
          'pebble-client/src/impl/*.js', 
          'pebble-client/src/interfaces/*.js'
        ],
        serverFiles: [
          'server/src/*.js' 
        ],
        serverTestFiles: [
          'server/test/*.js' 
        ],
        testFiles: [
          'pebble-client/test/*.js'
        ],
        templateFiles: [
          'frontend/controls/*.xml'
        ],
        pebbleservices: [
          'server/services/*.xml'
        ],
        templateCodeFiles: [
          'pebble-client/src/controls/*.js'
        ],
        templateTestFiles: [
          'pebble-client/test/controls/*.js'
        ],
        types: [
          'frontend/types/*.xml'
        ],
        cssPath: 'frontend/cssTemplates',
        accessPoints: [
          'frontend/accessPoints/*.xml'
        ],
        configFiles: ['config/*.json'],
        otherFiles: ['bower.json', 'Gruntfile.js', 'package.json', 'README.md', 'grunt-tasks/**/*.js'] 
      },
    },
    default_options: {
      options: {
      },
      files: {
        'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
      }
    },
    custom_options: {
      options: {
        separator: ': ',
        punctuation: ' !!!'
      },
      files: {
        'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
      }
    }
    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'pebble', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
