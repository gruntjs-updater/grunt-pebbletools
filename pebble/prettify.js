#!/usr/bin/env node

var fs = require("fs");
var pd = require("pretty-data").pd;

var ws = fs.readFileSync(process.argv[2], "utf-8");

var mode = process.argv[4] || 'json';

var out;
switch (mode) {
	case 'json':
		out = pd.json(ws);
		break;
		
	case 'xml':
		out = pd.xml(ws);
		break;

	case 'sql':
		out = pd.sql(ws);
		break;

	case 'css':
		out = pd.css(ws);
		break;

}

fs.writeFileSync(process.argv[3], out, "utf8");

