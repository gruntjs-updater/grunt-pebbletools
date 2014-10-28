'use strict';

var grunt = require('grunt');
var pebble = require("pebble-shared-node").pebble;
var PebbleDataSourceImpl_Json = require("pebble-object-json").PebbleDataSourceImpl_Json;

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

exports.pebble = {
  setUp: function(done) {
    done();
  },
  hasFiles: function(test) {
    test.expect(1);

    var inFile = grunt.file.read('test/fixtures/standard.json', {encoding:'utf8'});
    test.ok(inFile, 'tmp/standard.json must exist');
    var inPab = new pebble.Pebble(inFile);
    var outFile = grunt.file.read('tmp/standard_bundle.json', {encoding:'utf8'});
    //test.ok(outFile, 'tmp/standard_bundle.json must exist');
    //var outPeb = new pebble.Pebble(outFile);

    test.done();
  },

  hasAccessPoints: function(test) {

    test.done();
  }
};
