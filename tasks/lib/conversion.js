var fs = require("fs");
var p = require("path");
var pd = require("pretty-data").pd;
var pebble = require("pebble-shared-node").pebble;
var PebbleDataSourceImpl = require("pebble-object-xmldom").PebbleDataSourceImpl;
var PebbleDataSourceImpl_Json = require("pebble-object-json").PebbleDataSourceImpl_Json;

function xml2json(grunt, data) {

  var ws = grunt.file.read(data.input, {encoding: "utf-8"});

  var peb_xml = new PebbleDataSourceImpl(pd.xmlmin(ws));
  var json = PebbleDataSourceImpl.getJson(peb_xml.xml);
  var jsonStr = pd.json(JSON.stringify(json));

  grunt.file.write(data.output, jsonStr, {encoding: 'utf8'});
}

function json2xml(grunt, data) {

  var jsonStr = grunt.file.read(data.input, {encoding: "utf-8"});

  var xml = PebbleDataSourceImpl_Json.getXml(JSON.parse(jsonStr), PebbleDataSourceImpl);
  var out = pd.xml(xml.toString());

  grunt.file.write(data.output, out, {encoding: 'utf8'});
}

module.exports.xml2json = xml2json;
module.exports.json2xml = json2xml;



