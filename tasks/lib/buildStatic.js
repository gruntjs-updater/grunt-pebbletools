var fs = require('fs');
var p = require('path');
var pebble = require('pebble-shared-node').pebble;
var PebbleDataSourceImpl_Json = require('pebble-object-json').PebbleDataSourceImpl_Json;
var cwd = process.cwd();
pebble.Pebble.setDataSourceFactory(new PebbleDataSourceImpl_Json());
'use strict';

function interpolate(s, o) {
  for (var key in o) {
    s = s.replace(new RegExp('{{{' + key + '}}}', 'g'), o[key]);
  }
  return s;
}
function getPageObject (config, appType) {

  var o = {};
  for (var key in config) {
    var bundle = config[key];
    switch (key) {
      case 'head':
        o.head = getScripts(key, config);
      break;
      case 'vendor':
        o.vendor = getScripts(key, config);
      break;
      case 'app':
        o.app = getScripts(key, config);
      break;
      case 'templates':
        o.templates = getTemplates(key, config, appType);
      break;
    }
  };
  return o;
}

function getTemplates (key, config, appType) {
  var s = '';
  var paths = pebble.shared.Deployment.getFiles(key, [], config);
  for (var i = 0; i < paths.length; i++) {
    var file = paths[i];
    s += getTemplateTag(file, config[key].basePath, appType);
  }
  return s;
}

function getTemplateTag(path, basePath, appType) {

  switch (appType) {
    case 'emberjs':
      var name = path.replace(basePath + '/', '').replace('.hbs', '');
    var ret = '<script type="text/x-handlebars" data-template-name="' + name + '">';
    var file = fs.readFileSync(p.join(cwd, path), 'utf8');
    ret += file;
    ret += '</script>';
    return ret;

    case 'backbonejs':
      var name = path.replace(basePath + '/', '').replace('.html', '');
    var ret = '<script type="text/template" id="' + name + '">';
    var file = fs.readFileSync(p.join(cwd, path), 'utf8');
    ret += file;
    ret += '</script>';
    return ret;
  }
}

function getScripts (key, config){
  var s = '';
  var paths = pebble.shared.Deployment.getFiles(key, [], config);
  for (var i = 0; i < paths.length; i++) {
    var file = paths[i];
    s += "<script src='/" + file + "'></script>";
  }
  return s;
}


module.exports = function(gruntRef, data) {
  grunt = gruntRef;

  var list = fs.readdirSync(data.viewsPath); 

  list.forEach(function(file) {

    if (file.indexOf('.swp') == -1) {
      var s = fs.readFileSync(p.join(data.viewsPath, file), 'utf8');
      var configStr = fs.readFileSync(p.join(data.configsPath,  file.replace('.html','') + '.json'), 'utf8');
      var config = JSON.parse(configStr);
      s = interpolate(s, getPageObject(config, 'backbonejs'));
      console.log('writing ...' + file);
      fs.writeFileSync(p.join(data.outputPath, file), s, 'utf8');
    }

  });

};


