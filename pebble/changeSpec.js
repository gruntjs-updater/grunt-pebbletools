#!/usr/bin/env node

var fs = require("fs");
var p = require("path");
var pebble = require("pebble-object-node").pebble;
var PebbleDataSourceImpl = require("pebble-object-xmldom").PebbleDataSourceImpl;

//pebble data source						
pebble.Pebble.setDataSourceFactory(new PebbleDataSourceImpl());
var ws = fs.readFileSync("workspace.min.xml", "utf-8");
var workspace = new pebble.Pebble(ws.trim());

changeSpec(workspace);

fs.writeFileSync("changeSpec.xml", workspace.toString(), "utf8");


//----- changespec
function changeSpec(workspacePeb) {
	var report = "";
	var tables = workspacePeb.getRecords(".");
	var count = 0;
	for (var i = 0; i < tables.length; i++) {
		var table = tables[i];
		var tableLastName = table.getTagName().split("_").pop();
		//if (tableLastName == "controls") {
		var docs = table.getRecords(".");
		for (var j = 0; j < docs.length; j++) {
			count += 1;
			var doc = docs[j];
			changeDoc(doc);
			//report += doc.getTagName() + "\n";
		}
		//}
	}
	report += "count: " + count + "\r\n";
	return report;
}

function changeDoc(doc) {

	changePeb(doc.get("."));
	//var innerMarkup = doc.get("innerMarkup");
	//if (innerMarkup) {

	//changePeb(innerMarkup);
	//}
	return "";
}

function changePeb(peb) {
	//if (peb.getTagName() == "control" || peb.getTagName() == "displayControl") {
	var longRef = peb.getRef(".");
	if (longRef && longRef.indexOf("theModel") != -1) {
		var newRef = longRef.replace("theModel", "whoowhoo");

		peb.setRef(".", newRef);
	}

	//}
	var recs = peb.getRecords(".");
	for (var i = 0; i < recs.length; i++) {
		var rec = recs[i];
		changePeb(rec);
	}
}

