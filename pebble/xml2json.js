#!/usr/bin/env node

var fs = require("fs");
var pd = require("pretty-data").pd;
var pebble = require("pebble-shared-node").pebble;
var PebbleDataSourceImpl = require("pebble-object-xmldom").PebbleDataSourceImpl;
var PebbleDataSourceImpl_Json = require("pebble-object-json").PebbleDataSourceImpl_Json;

var ws = fs.readFileSync(process.argv[2], "utf-8");

var peb_xml = new PebbleDataSourceImpl(pd.xmlmin(ws));
var json = PebbleDataSourceImpl.getJson(peb_xml.xml);
var jsonStr = pd.json(JSON.stringify(json));

fs.writeFileSync(process.argv[3], jsonStr, "utf8");

