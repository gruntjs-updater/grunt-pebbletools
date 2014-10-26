'use strict';

var grunt = require('grunt');

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

exports.pebble = {
  setUp: function(done) {
    done();
  },
  hasInstance: function(test) {
    test.expect(1);

    test.ok(grunt.file.read('tmp/theInstance.xml'), 'should have extracted theInstance');

    test.done();
  },

  hasAccessPoints: function(test) {

    test.ok(grunt.file.read('tmp/frontend/accessPoints/testAppControl/testAppControl.xml'), 'accessPoint');
    test.ok(grunt.file.read('tmp/frontend/accessPoints/testAppControl/topControl.xml'), 'accessPoint/topControl');
    test.ok(grunt.file.read('tmp/frontend/accessPoints/testAppControl/config.json'), 'accessPoint/config');

    test.done();
  },

  hasControls: function(test) {
    test.ok(grunt.file.read('tmp/frontend/controls/ClientControl/ClientControl.xml'), 'controls/ClientControl');
    test.ok(grunt.file.read('tmp/frontend/controls/ClientControl/functions/getData.xml'), 'controls/functions/getData');
    test.done();
  },

  hasCssTemplates: function(test) {
    test.ok(grunt.file.read('tmp/frontend/cssTemplates/standard.css'), 'cssTemplates/standard.css');
    test.done();
  },

  hasClientScripts: function(test) {
    test.ok(grunt.file.read('tmp/frontend/src/testServer.js'), 'src/testServer.js');
    test.done();
  },

  hasClientTests: function(test) {
    test.ok(grunt.file.read('tmp/frontend/test/controls/ArrayTreeBase.js'), 'test/ArrayTreeBase.js');
    test.done();
  },

  hasTypes: function(test) {
    test.ok(grunt.file.read('tmp/frontend/types/text.xml'), 'types/text.xml');
    test.done();
  },

  hasServerServices: function(test) {
    test.ok(grunt.file.read('tmp/server/services/doInit.xml'), 'server/services/doInit.xml');
    test.done();
  },

  hasServerScripts: function(test) {
    //test.ok(grunt.file.read('tmp/server/src/a0.js'), 'server/src/a0.js');
    test.done();
  }
};
