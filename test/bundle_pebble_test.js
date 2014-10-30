'use strict';

var grunt = require('grunt');
var fs = require('fs');
var p = require('path');
var pebble = require("pebble-shared-node").pebble;
var PebbleDataSourceImpl_Json = require("pebble-object-json").PebbleDataSourceImpl_Json;

var topDir = process.cwd();
var inPeb, outPeb;

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

exports.bundle_pebble_test = {
  setUp: function(done) {
    var inFile = grunt.file.read('test/fixtures/standard.json', {encoding:'utf8'});
    inPeb = new pebble.Pebble(inFile);
    var outFile = grunt.file.read('tmp/standard_bundle.json', {encoding:'utf8'});
    outPeb = new pebble.Pebble(outFile);
    done();
  },
  hasFiles: function(test) {
    test.expect(2);

    test.ok(inPeb, 'tmp/standard.json must exist');
    test.ok(outPeb, 'tmp/standard_bundle.json must exist');

    test.done();
  },

  hasAccessPoints: function(test) {
    test.expect(4);

    var accessPointsPath = 'theModel_appInstances.theInstance.deployment.accessPoints';
    var files = fs.readdirSync('tmp/frontend/accessPoints');
    test.equal(outPeb.getRecords(accessPointsPath).length, files.length);

    var testAppControl = outPeb.get(accessPointsPath + '.testAppControl');
    test.ok(testAppControl, 'should have testAppControl');
    test.ok(testAppControl.getValue('config'), 'should have testAppControl config as markup');
    test.ok(testAppControl.getRef('topControl'), 'should have testAppControl config, and ref');

    test.done();
  },

  hasClientScripts: function(test) {
    test.expect(1);

    var tablePath = 'theModel_appInstances.theInstance.clientScripts';
    var tmpControlsPath = 'tmp/frontend/src';
    var files = fs.readdirSync(tmpControlsPath);
    test.equal(outPeb.getRecords(tablePath).length, files.length, 'number of scripts');

    test.done();
  },

  hasServerScripts: function(test) {
    test.expect(1);

    var tablePath = 'theModel_appInstances.theInstance.serverScripts';
    var tmpControlsPath = 'tmp/server/src';
    var files = fs.readdirSync(tmpControlsPath);
    test.equal(outPeb.getRecords(tablePath).length, files.length, 'number of scripts');

    test.done();
  },

  hasCssTemplates: function(test) {
    test.expect(1);

    var tablePath = 'theModel_appInstances.theInstance.cssTemplates';
    var tmpControlsPath = 'tmp/frontend/cssTemplates';
    var files = fs.readdirSync(tmpControlsPath);
    test.equal(outPeb.getRecords(tablePath).length, files.length, 'number of templates');

    test.done();
  },

  hasControls: function(test) {
    //test.expect(1);

    var tablePath = 'theModel_controls';
    var tmpControlsPath = 'tmp/frontend/controls';
    var files = fs.readdirSync(tmpControlsPath);
    test.equal(outPeb.getRecords(tablePath).length, files.length);

    //functions
    var clientControl = outPeb.get(tablePath + '.ClientControl');
    test.ok(clientControl, 'should have clientControl');
    test.equal(outPeb.getRecords(tablePath + '_ClientControl_functions').length, fs.readdirSync(tmpControlsPath + '/ClientControl/functions').length);

    var appControlBase = outPeb.get(tablePath + '.AppControlBase');
    test.ok(appControlBase, 'should have appControlBase');

    //code
    //test.ok(appControlBase.getValue('devCoe'), 'should have dev code as markup');

    //tests
    test.ok(appControlBase.getValue('testCode'), 'should have test code as markup');
    test.done();
  },

  hasServices: function(test) {
    test.expect(1);

    var tablePath = 'theModel_services';
    var tmpControlsPath = 'tmp/server/services';
    var files = fs.readdirSync(tmpControlsPath);
    test.equal(outPeb.getRecords(tablePath).length, files.length);

    test.done();
  },

  hasTypes: function(test) {
    test.expect(1);

    var tablePath = 'theModel_types';
    var tmpControlsPath = 'tmp/frontend/types';
    var files = fs.readdirSync(tmpControlsPath);
    test.equal(outPeb.getRecords(tablePath).length, files.length);

    test.done();
  }
};
