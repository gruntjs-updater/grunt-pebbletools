var fs = require("fs");
var p = require("path");
var pebble = require("pebble-object-node").pebble;
var PebbleDataSourceImpl_Json = require('pebble-object-json').PebbleDataSourceImpl_Json;

'use strict';

function changeSpec(workspacePeb, data) {
	var report = "";
	var tables = workspacePeb.getRecords(".");
  if (data.tableFilter) {
    tables = tables.map(data.tableFilter);
  }
	var count = 0;
	for (var i = 0; i < tables.length; i++) {
		var table = tables[i];
		var docs = table.getRecords(".");
		for (var j = 0; j < docs.length; j++) {
			count += 1;
			var doc = docs[j];
      if (data.changePeb) {
        data.changePeb(doc, data);
      } 
			//report += doc.getTagName() + "\n";
		}
	}
	report += "count: " + count + "\r\n";
	return report;
}

module.exports = function(grunt, data) {
  
  //pebble data source						
  pebble.Pebble.setDataSourceFactory(new PebbleDataSourceImpl_Json());
  var ws = fs.readFileSync(data.input, {encoding: 'utf8'});
  var workspace = new pebble.Pebble(ws.trim());
  changeSpec(workspace);
  grunt.file.write(data.output, workspace.toString(), {encoding: 'utf8'});
};




