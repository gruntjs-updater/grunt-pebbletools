#!/usr/bin/env node

var fs = require("fs");
var p = require("path");
var pd = require("pretty-data").pd;
var pebble = require("pebble-shared-node").pebble;
var PebbleDataSourceImpl = require("pebble-object-xmldom").PebbleDataSourceImpl;
var PebbleDataSourceImpl_Json = require("pebble-object-json").PebbleDataSourceImpl_Json;

var jsonStr = fs.readFileSync(process.argv[2], "utf-8");

var xml = PebbleDataSourceImpl_Json.getXml(JSON.parse(jsonStr), PebbleDataSourceImpl);
var out = pd.xml(xml.toString());

fs.writeFileSync(process.argv[3], out, "utf8");

