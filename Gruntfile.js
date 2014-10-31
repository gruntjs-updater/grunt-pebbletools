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
      extractPebble:{
        projectPath: 'tmp',
        appPath: 'test/fixtures/standard.json'
      },
      bundlePebble: {
        outputFile : 'tmp/standard_bundle.json',
        projectPath: 'tmp'
      },
      extract:{
        projectPath: 'tmp',
        appPath: 'test/fixtures/appstack.json'
      },
      bundle: {
        outputFile : 'tmp/appstack_bundle.json',
        projectPath: 'tmp',
        clientFiles: [
          'tmp/frontend/scenarios/components/*.js', 'tmp/frontend/scenarios/controllers/*.js', 'tmp/frontend/scenarios/models/*.js', 'tmp/frontend/scenarios/routes/**/*.js',
          'tmp/frontend/sessions/collections/*.js', 'tmp/frontend/sessions/models/*.js', 'tmp/frontend/sessions/router.js' 
        ],
        clientTestFiles: [ ],
        cssTemplates: null,
        serverFiles: [ ],
        serverTestFiles: [ ],
        templateFiles: [
          'tmp/frontend/scenarios/templates/**/*.hbs',
          'tmp/frontend/sessions/templates/*.html'
        ],
        templateCodeFiles: [
          'tmp/frontend/sessions/views/*.js'
        ],
        templateTestFiles: [ ],
        accessPoints: ['tmp/config/*.json'],
        viewFiles: ['tmp/views/*.html'],
        otherFiles: ['tmp/app.js', 'tmp/bower.json', 'tmp/Gruntfile.js', 'tmp/package.json', 'tmp/README.md', 'tmp/grunt-tasks/**/*.js'] 
      },
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

  grunt.registerTask('test', ['testPebbleExtract', 'testPebbleBundle', 'testOtherExtract', 'testOtherBundle']);
  grunt.registerTask('testPebbleExtract', ['clean', 'pebbletools:extractPebble', 'nodeunit:testPebbleExtract']);
  grunt.registerTask('testPebbleBundle', ['pebbletools:bundlePebble', 'nodeunit:testPebbleBundle']);
  grunt.registerTask('testOtherExtract', ['clean', 'pebbletools:extract', 'nodeunit:testOtherExtract']);
  grunt.registerTask('testOtherBundle', ['pebbletools:bundle', 'nodeunit:testOtherBundle']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
