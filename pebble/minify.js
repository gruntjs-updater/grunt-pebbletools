#!/usr/bin/env node

var fs = require("fs");
var pd = require("pretty-data").pd;

var ws = fs.readFileSync(process.argv[2], "utf-8");

var mode = process.argv[4] || 'json';

var out;
switch (mode) {
	case 'json':
		out = pd.jsonmin(ws);
		break;
		
	case 'xml':
		out = pd.xmlmin(ws);
		break;

	case 'sql':
		out = pd.sqlmin(ws);
		break;

	case 'css':
		out = pd.cssmin(ws);
		break;

}

fs.writeFileSync(process.argv[3], out, "utf8");

