
var fs = require('fs');
var p = require('path');
var pd = require("pretty-data").pd;
var pebble = require('pebble-shared-node').pebble;
var PebbleDataSourceImpl_Json = require('pebble-object-json').PebbleDataSourceImpl_Json;
var PebbleDataSourceImpl = require("pebble-object-xmldom").PebbleDataSourceImpl;
var basePath = process.cwd();


'use strict';

function json2xml(pebJson) {
  var xml = PebbleDataSourceImpl_Json.getXml(pebJson, PebbleDataSourceImpl);
  var out = pd.xml(xml.toString());
  return out;
}

function processOtherFiles(otherFiles, data) {
  //otherFiles
  console.log('\n----- otherFiles -----');
  //var otherFiles = otherFiles.getRecords('.');
  //for (var i = 0; i < otherFiles.length; i++) {
    //writeFile(otherFiles[i], 'contents', '.');
  //}
}
function processServices(services, data) {
  //services
  console.log('\n----- services -----');
  var services = services.getRecords('.');
  for (var i = 0; i < services.length; i++) {
    var service = services[i];
    writeFile(service, '.', 'server/services', 'xml', true);
  }
}
function processTypes(types, data) {
  //types
  console.log('\n----- types -----');
  var types = types.getRecords('.');
  for (var i = 0; i < types.length; i++) {
    var type = types[i];
    writeFile(type, '.', 'frontend/types', 'xml', true);
  }
}

function processPebbleControls(tables, controls, data) {
  //pebbleControls
  console.log('\n----- pebble controls -----');
  var controls = controls.getRecords('.');
  for (var i = 0; i < controls.length; i++) {
    var control = controls[i];
    var controlName = control.getTagName();
    tables.forEach(function(table) {

      var tableName = table.getTagName(); 
      if (tableName == 'theModel_controls_' + controlName + '_functions') {
        console.log('\n----- control functions -----');
        var funcs = table.getRecords('.');
        for (var i = 0; i < funcs.length; i++) {
          var func = funcs[i];
          writeFile(func, '.', 'frontend/controls/' + controlName + '/functions', 'xml', true);
        }
      }
    });

    grunt.file.write('frontend/controls/' + controlName + '/' + controlName + '.xml', json2xml(control.impl.xml), {encoding: 'utf8'});
  }
}

function processOtherOtherFiles(otherFiles, data) {
  //otherFiles
  console.log('\n----- otherFiles -----');
  var otherFiles = otherFiles.getRecords('.');
  for (var i = 0; i < otherFiles.length; i++) {
    var otherFile = otherFiles[i];
    grunt.file.write(otherFile.getValue('path'), otherFile.getValue('contents'), {encoding: 'utf8'});
  }
}
function processOtherControls(controls, data) {
  //templates
  console.log('\n----- templates -----');
  var controls = controls.getRecords('.');
  for (var i = 0; i < controls.length; i++) {
    var control = controls[i];
    var template = control.getValue('template');
    if (template) {
      grunt.file.write(control.getValue('templatePath'), control.getValue('template'), {encoding: 'utf8'});
    } 
  }
}

function processOtherAppInstance(appInstances, data) {

  var theInstance = appInstances.get('theInstance');

  console.log('\n----- clientFiles -----');
  var clientScripts = theInstance.getRecords('clientScripts');
  if (clientScripts.length > 0) {
    for (var i = 0; i < clientScripts.length; i++) {
      var clientScript = clientScripts[i];
      grunt.file.write(clientScript.getValue('codePath'), clientScript.getValue('devCode'), {encoding: 'utf8'});

      var testCode = clientScript.get('testCode');
      if (testCode) {
        grunt.file.write(clientScript.getValue('testCodePath'), clientScript.getValue('testCode'), {encoding: 'utf8'});
      }
    }
    theInstance.remove('clientScripts');
  }

  console.log('\n----- serverFiles -----');
  var serverScripts = theInstance.getRecords('serverScripts');
  if (serverScripts.length > 0) {
    for (var i = 0; i < serverScripts.length; i++) {
      var serverScript = serverScripts[i];
      grunt.file.write(serverScript.getValue('codePath'), serverScript.getValue('devCode'), {encoding: 'utf8'});

      var testCode = serverScript.get('testCode');
      if (testCode) {
        grunt.file.write(serverScript.getValue('testCodePath'), serverScript.getValue('testCode'), {encoding: 'utf8'});
      }
    }
    theInstance.remove('serverScripts');
  }

  console.log('\n----- cssTemplates -----');
  var cssTemplates = theInstance.getRecords('cssTemplates');
  if (cssTemplates.length > 0) {
    for (var i = 0; i < cssTemplates.length; i++) {
      var cssTemplate = cssTemplates[i];
      writeFile(cssTemplate, 'css', 'frontend/cssTemplates', 'css');
      var less = cssTemplate.getRecords('less');
      for (var j = 0; j < less.length; j++) {
        //writeFile(less[j], '.', 'frontend/cssTemplates/' + cssTemplate.getTagName(), 'less');
      }
    }
    theInstance.remove('cssTemplates');
  }

  console.log('\n----- stringMaps -----');
  var stringMaps = theInstance.getRecords('stringMaps');
  if (stringMaps.length > 0) {
    for (var i = 0; i < stringMaps.length; i++) {
      var stringMap = stringMaps[i];
      writeFile(stringMap, '.', 'frontend/stringMaps', 'xml', true);
      var strings = stringMap.getRecords('.');
      strings.forEach(function(string) {
        //grunt.file.write('frontend/stringMaps/' + stringMap.getTagName() + '/' + string.getTagName() + '.txt', string.getValue('.'), {encoding: 'utf8'});
      });
    }
    theInstance.remove('stringMaps');
  }

  console.log('\n----- accessPoints -----');
  var accessPoints = theInstance.getRecords('deployment.accessPoints');
  if (accessPoints.length > 0) {
    for (var i = 0; i < accessPoints.length; i++) {
      var accessPoint = accessPoints[i];
      var accessPointsPath = p.join('frontend/accessPoints', accessPoint.getTagName());
      var config = accessPoint.getValue('config');
      if (config) {
        grunt.file.write(accessPoint.getValue('configPath'), accessPoint.getValue('config'), {encoding: 'utf8'});
      }
      var view = accessPoint.getValue('htmlpage');
      if (view) {
        grunt.file.write(accessPoint.getValue('viewPath'), accessPoint.getValue('htmlpage'), {encoding: 'utf8'});
      }
    }
    theInstance.remove('deployment.accessPoints');
  }

  console.log('\n----- pebble.json -----');
  var mainConfig = theInstance.get('mainConfig');
  if (mainConfig) {
    grunt.file.write('pebble.json', mainConfig.getValue('.'), {encoding: 'utf8'});
    theInstance.remove('mainConfig');
  }
}

function processAppInstance(appInstances, data) {

  var theInstance = appInstances.get('theInstance');

  //clientFiles
  console.log('\n----- clientFiles -----');
  var clientScripts = theInstance.getRecords('clientScripts');
  if (clientScripts.length > 0) {
    for (var i = 0; i < clientScripts.length; i++) {
      var clientScript = clientScripts[i];
      var devCode = clientScript.get('devCode');
      if (devCode) {
        //writeFile(clientScript, 'devCode', 'frontend/src', 'js');
        grunt.file.write(clientScript.getValue('codePath'), clientScript.getValue('devCode'), {encoding: 'utf8'});
      }

      var testCode = clientScript.get('testCode');
      if (testCode) {
        //writeFile(testCode, '.', 'frontend/test', 'js');
        grunt.file.write(clientScript.getValue('testCodePath'), clientScript.getValue('testCode'), {encoding: 'utf8'});
      }
    }
    theInstance.remove('clientScripts');
  }

  //serverFiles
  console.log('\n----- serverFiles -----');
  var serverScripts = theInstance.getRecords('serverScripts');
  if (serverScripts.length > 0) {
    for (var i = 0; i < serverScripts.length; i++) {
      var serverScript = serverScripts[i];
      writeFile(serverScript, 'devCode', 'server/src', 'js');

      var testCode = serverScript.get('testCode');
      if (testCode) {
        writeFile(testCode, '.', 'server/test', 'js');
      }
    }
    theInstance.remove('serverScripts');
  }

  //cssTemplates (take both css and less children)
  console.log('\n----- cssTemplates -----');
  var cssTemplates = theInstance.getRecords('cssTemplates');
  if (cssTemplates.length > 0) {
    for (var i = 0; i < cssTemplates.length; i++) {
      var cssTemplate = cssTemplates[i];
      writeFile(cssTemplate, 'css', 'frontend/cssTemplates', 'css');
      var less = cssTemplate.getRecords('less');
      for (var j = 0; j < less.length; j++) {
        writeFile(less[j], '.', 'frontend/cssTemplates/' + cssTemplate.getTagName(), 'less');
      }
    }
    theInstance.remove('cssTemplates');
  }

  //stringMaps
  console.log('\n----- stringMaps -----');
  var stringMaps = theInstance.getRecords('stringMaps');
  if (stringMaps.length > 0) {
    for (var i = 0; i < stringMaps.length; i++) {
      var stringMap = stringMaps[i];
      writeFile(stringMap, '.', 'frontend/stringMaps', 'xml', true);
      var strings = stringMap.getRecords('.');
      strings.forEach(function(string) {
        grunt.file.write('frontend/stringMaps/' + stringMap.getTagName() + '/' + string.getTagName() + '.txt', string.getValue('.'), {encoding: 'utf8'});
      });
    }
    theInstance.remove('stringMaps');
  }

  //accessPoints
  console.log('\n----- accessPoints -----');
  var accessPoints = theInstance.getRecords('deployment.accessPoints');
  if (accessPoints.length > 0) {
    for (var i = 0; i < accessPoints.length; i++) {
      var accessPoint = accessPoints[i];
      var accessPointsPath = p.join('frontend/accessPoints', accessPoint.getTagName());
      var config = accessPoint.getValue('config');
      if (config) {
        grunt.file.write(accessPointsPath + '/config.json', config, {encoding: 'utf8'});
        accessPoint.remove('config');
      }
      var topControl = accessPoint.get('topControl');
      if (topControl) {
        grunt.file.write(accessPointsPath + '/topControl.xml', json2xml(topControl.impl.xml), {encoding: 'utf8'});
        accessPoint.remove('topControl');
      }
      if (accessPoint.getRecords('.').length > 0) {
        writeFile(accessPoint, '.', accessPointsPath, 'xml', true);
      }
    }
    theInstance.remove('deployment.accessPoints');
  }
  
  console.log('\n----- pebble.json -----');
  var mainConfig = theInstance.get('mainConfig');
  if (mainConfig) {
    grunt.file.write('pebble.json', mainConfig.getValue('.'), {encoding: 'utf8'});
    theInstance.remove('mainConfig');
  }

  //description, actorGroups, deployment.theControlApp
  grunt.file.write('theInstance.xml', json2xml(theInstance.impl.xml), {encoding: 'utf8'});
}

function writeFile(peb, contentsPath, defaultPath, defaultExt, isPebbleControl) {
  var name = peb.getTagName();
  //var path = peb.getValue('path') || defaultPath;
  var path = defaultPath;
  var ext = peb.getValue('ext') || defaultExt;
  var contents;
  if (isPebbleControl) {
    var innerMarkup = peb.get(contentsPath);
    contents = json2xml(innerMarkup.impl.xml);
  } else {
    contents = peb.getValue(contentsPath);
  }
  console.log(name);
  grunt.file.write(p.join(path, name + '.' + ext), contents, {encoding: 'utf8'});
}

function extractPebbleProject(gruntRef, data) {

  grunt = gruntRef;

  pebble.Pebble.setDataSourceFactory(new PebbleDataSourceImpl_Json());
  var libStr = fs.readFileSync(data.appPath, 'utf-8');
  var lib = new pebble.Pebble(libStr);

  var tables = lib.getRecords('.');
  tables.forEach(function(table) {

    var tableName = table.getTagName(); 

    switch (tableName) {
      case 'theModel_appInstances':
        processAppInstance(table, data);
      break;

      case 'theModel_controls':
        processPebbleControls(tables, table, data);
      break;

      case 'theModel_types':
        processTypes(table, data);
      break;

      case 'theModel_services':
        processServices(table, data);
      break;

      case 'theModel_otherFiles':
        processOtherFiles(table, data);
      break;

      default:
        if (tableName.indexOf('_functions') != -1) {
        
        } else {
          console.log('unprocessed table: ' + tableName);
        }
    }
  });
}

function extractOtherProject(gruntRef, data) {

  grunt = gruntRef;

  pebble.Pebble.setDataSourceFactory(new PebbleDataSourceImpl_Json());
  var libStr = fs.readFileSync(data.appPath, 'utf-8');
  var lib = new pebble.Pebble(libStr);

  var tables = lib.getRecords('.');
  tables.forEach(function(table) {

    var tableName = table.getTagName(); 

    switch (tableName) {
      case 'theModel_appInstances':
        processOtherAppInstance(table, data);
      break;

      case 'theModel_controls':
        processOtherControls(table, data);
      break;

      case 'theModel_otherFiles':
        processOtherOtherFiles(table, data);
      break;

      default:
        console.log('unprocessed table: ' + tableName);
    }

  });
}

module.exports.extractPebbleProject = extractPebbleProject;
module.exports.extractOtherProject = extractOtherProject;
