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
      extract:{
        appPath: 'test/fixtures/appstack.json'
      },
      bundle: {
        outputFile : 'appstack_bundle.json',
        clientFiles: [
          'frontend/scenarios/components/*.js', 'frontend/scenarios/controllers/*.js', 'frontend/scenarios/models/*.js', 'frontend/scenarios/routes/**/*.js',
          'frontend/sessions/collections/*.js', 'frontend/sessions/models/*.js', 'frontend/sessions/router.js' 
        ],
        clientTestFiles: [ ],
        cssTemplates: null,
        serverFiles: [ ],
        serverTestFiles: [ ],
        templateFiles: [
          'frontend/scenarios/templates/**/*.hbs',
          'frontend/sessions/templates/*.html'
        ],
        accessPoints: ['config/*.json'],
        viewFiles: ['views/*.html'],
        //otherFiles: ['app.js', 'bower.json', 'Gruntfile.js', 'package.json', 'README.md', 'grunt-tasks/**/*.js'] 
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

  grunt.registerTask('test', ['testPebbleExtract', 'testPebbleBundle', 'testOtherExtract', 'testOtherBundle']);
  grunt.registerTask('testPebbleExtract', ['clean', 'pebbletools:extractPebble', 'nodeunit:testPebbleExtract']);
  grunt.registerTask('testPebbleBundle', ['pebbletools:bundlePebble', 'nodeunit:testPebbleBundle']);
  grunt.registerTask('testOtherExtract', ['clean', 'pebbletools:extract', 'nodeunit:testOtherExtract']);
  grunt.registerTask('testOtherBundle', ['pebbletools:bundle', 'nodeunit:testOtherBundle']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
