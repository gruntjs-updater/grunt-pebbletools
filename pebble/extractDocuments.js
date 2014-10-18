#!/usr/bin/env node

var fs = require("fs");
var p = require("path");
var pd = require("pretty-data").pd;
var pebble = require("pebble-object-node").pebble;
var PebbleDataSourceImpl = require("pebble-object-xmldom").PebbleDataSourceImpl;
var TABLES = "tables";

load();

function load() {
	//pebble data source						
	pebble.Pebble.setDataSourceFactory(new PebbleDataSourceImpl());

	rmDir(TABLES);

	if (!fs.existsSync(TABLES)) {
		fs.mkdirSync(TABLES);
	}

	var ws = fs.readFileSync("workspace.xml", "utf-8");
	
	ws = pd.xml(ws);

	var workspace = new pebble.Pebble(ws);
	
	var tables = workspace.getRecords(".");
	for (var i = 0; i < tables.length; i++) {
		var table = tables[i];
		var tableName = table.getTagName();

		var dir = p.join("tables", tableName);
		fs.existsSync(dir) || fs.mkdirSync(dir);

		var documents = table.getRecords(".");
		for (var j = 0; j < documents.length; j++) {
			var doc = documents[j];
			var docName = doc.getTagName();
			fs.writeFileSync(p.join(dir, docName + ".xml"), doc.toString(), "utf8");
		}
	}
	fs.writeFileSync("workspace.xml", ws, "utf8");
	fs.writeFileSync("workspace.min.xml", pd.xmlmin(ws), "utf8");
}
function rmDir(dirPath) {
	try { 
		var files = fs.readdirSync(dirPath); 
	} catch(e) { 
		return; 
	}
	if (files.length > 0) {
		for (var i = 0; i < files.length; i++) {
			var filePath = dirPath + '/' + files[i];
			if (fs.statSync(filePath).isFile())
				fs.unlinkSync(filePath);
			else
				rmDir(filePath);
		}
	}
	fs.rmdirSync(dirPath);
}
