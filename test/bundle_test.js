'use strict';

var grunt = require('grunt');
var fs = require('fs');
var p = require('path');
var pebble = require("pebble-shared-node").pebble;
var PebbleDataSourceImpl_Json = require("pebble-object-json").PebbleDataSourceImpl_Json;

var topDir = process.cwd();
var outPeb;

pebble.Pebble.setDataSourceFactory(new PebbleDataSourceImpl_Json());
/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/


exports.bundle_tests = {
  setUp: function(done) {
    var outFile = grunt.file.read('tmp/appstack_bundle.json', {encoding:'utf8'});
    outPeb = new pebble.Pebble(outFile);
    done();
  },

  hasClientCode: function(test) {

    var path = 'theModel_appInstances.theInstance.clientScripts';

    var recs = outPeb.getRecords(path);
    recs.forEach(function(peb) {
      if (peb.get('devCode') != null) {
        test.ok(grunt.file.read(peb.getValue('codePath'), {encodeing:'utf8'}), 'should have file in codePath');
      }
      if (peb.get('testCode') != null) {
        test.ok(grunt.file.read(peb.getValue('testCodePath'), {encodeing:'utf8'}), 'should have file in testCodePath');
      }
    });

    test.done();
  },

  hasAccessPoints: function(test) {

    var accessPointsPath = 'theModel_appInstances.theInstance.deployment.accessPoints';

    var accessPoints = outPeb.getRecords(accessPointsPath);
    accessPoints.forEach(function(accessPoint) {
      if (accessPoint.get('htmlpage') != null) {
        test.ok(grunt.file.read(accessPoint.getValue('viewPath'), {encodeing:'utf8'}), 'should have view file in viewPath');
      }
      if (accessPoint.get('config') != null) {
        test.ok(grunt.file.read(accessPoint.getValue('configPath'), {encodeing:'utf8'}), 'should have config file in configPath');
      }
    });

    test.done();
  },

  hasCssTemplates: function(test) {

    var path = 'theModel_appInstances.theInstance.cssTemplates';

    var recs = outPeb.getRecords(path);
    recs.forEach(function(peb) {
      //if (peb.get('devCode') != null) {
        //test.ok(grunt.file.read(peb.getValue('codePath'), {encodeing:'utf8'}), 'should have file in codePath');
      //}
      //if (peb.get('testCode') != null) {
        //test.ok(grunt.file.read(peb.getValue('testCodePath'), {encodeing:'utf8'}), 'should have file in testCodePath');
      //}
    });

    test.done();
  },

  hasServerCode: function(test) {

    var path = 'theModel_appInstances.theInstance.serverScripts';

    var recs = outPeb.getRecords(path);
    recs.forEach(function(peb) {
      if (peb.get('devCode') != null) {
        test.ok(grunt.file.read(peb.getValue('codePath'), {encodeing:'utf8'}), 'should have file in codePath');
      }
      if (peb.get('testCode') != null) {
        test.ok(grunt.file.read(peb.getValue('testCodePath'), {encodeing:'utf8'}), 'should have file in testCodePath');
      }
    });

    test.done();
  },

  hasTemplates: function(test) {

    var path = 'theModel_controls';

    var recs = outPeb.getRecords(path);
    recs.forEach(function(peb) {
      if (peb.get('template') != null) {
        test.ok(grunt.file.read(peb.getValue('templatePath'), {encodeing:'utf8'}), 'should have file in templatePath');
      }
      if (peb.get('code') != null) {
        test.ok(grunt.file.read(peb.getValue('codePath'), {encodeing:'utf8'}), 'should have file in codePath');
      }
      if (peb.get('testCode') != null) {
        test.ok(grunt.file.read(peb.getValue('testCodePath'), {encodeing:'utf8'}), 'should have file in testCodePath');
      }
    });

    test.done();
  },
  
  hasOtherFiles: function(test) {

    var path = 'theModel_otherFiles';

    var recs = outPeb.getRecords(path);
    recs.forEach(function(peb) {
      if (peb.get('contents') != null) {
        test.ok(grunt.file.read(peb.getValue('path'), {encodeing:'utf8'}), 'should have file in path');
      }
    });

    test.done();
  }

};


