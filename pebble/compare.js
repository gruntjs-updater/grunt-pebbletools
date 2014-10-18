#!/usr/bin/env node

var fs = require("fs");
var p = require("path");
var pebble = require("pebble-shared-node").pebble;
var PebbleDataSourceImpl_Json = require("pebble-object-json").PebbleDataSourceImpl_Json;

pebble.Pebble.setDataSourceFactory(new PebbleDataSourceImpl_Json());

var xStr = fs.readFileSync(process.argv[2], "utf-8");
var yStr = fs.readFileSync(process.argv[3], "utf-8");

var x = new pebble.Pebble(xStr);
var y = new pebble.Pebble(yStr);
var count = 0;

var report = comparePeb(x, y);

fs.writeFileSync("report.txt", report, "utf8");

function comparePeb(xpeb, ypeb, path, report) {
  path = path || '';
  report = report || '';
  var recs = xpeb.getRecords('.');
  recs.forEach(function(xrec) {
    var tagName = xrec.getTagName();
    var yrec = ypeb.get(tagName);
    var fullPath = path == '' ? tagName : path + '.' + tagName;
    if (!yrec) {
      console.log('! ' + fullPath);
      report += fullPath + '\r\n';
    } else {
      //keep going 
      count += 1;
      if (count < 1000 && xrec instanceof pebble.Pebble) {
        console.log(fullPath);
        report += comparePeb(xrec, yrec, fullPath, report);
      }
    }
  });
  return report;
}

