var fs = require('fs');
var p = require('path');
var pd = require("pretty-data").pd;

'use strict';

function minify(grunt, data) {

  var ws = grunt.file.read(data.input, {encoding: "utf-8"});

  var mode = data.mode || 'json';

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

  grunt.file.write(data.output, out, {encoding: 'utf8'});

}

function prettify(grunt, data) {

  var ws = grunt.file.read(data.input, {encoding: "utf-8"});

  var mode = data.mode || 'json';

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

  grunt.file.write(data.output, out, {encoding: 'utf8'});

}


module.exports.minify = minify;
module.exports.prettify = prettify;
