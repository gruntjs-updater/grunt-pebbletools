var fs = require('fs');
var p = require('path');
var pd = require("pretty-data").pd;
var pebble = require('pebble-shared-node').pebble;
var PebbleDataSourceImpl_Json = require('pebble-object-json').PebbleDataSourceImpl_Json;
var PebbleDataSourceImpl = require("pebble-object-xmldom").PebbleDataSourceImpl;
var grunt;
var basePath; 

'use strict';

function xml2json(xmlStr) {
  var peb_xml = new PebbleDataSourceImpl(pd.xmlmin(xmlStr));
  var json = PebbleDataSourceImpl.getJson(peb_xml.xml);
  var jsonStr = pd.json(JSON.stringify(json));
  return jsonStr;
}


function compressGlob(glob, lib, setInDocPath, setInLibPath, pathPath, isPebbleControl) {
  if (glob) {
    //directory paths
    var files = grunt.file.expand(glob);
    files.forEach(function(file) {
      setLibDoc(lib, file, setInDocPath, setInLibPath, pathPath, isPebbleControl);
    });
  }
}

function setLibDoc(lib, file, setInDocPath, setInLibPath, pathPath, isPebbleControl) {
  console.log(file);
  if (file.indexOf('.') != 0) {
    pathPath = pathPath || 'path'; //some docs need to use specific paths
    var fileName = file.split('/').pop();
    var fileElements = fileName.split('.');
    var ext = fileElements.pop();
    var name = fileElements.join('_'); //replace . with _
    var doc = lib.getCreateOnNull(setInLibPath + '.' + name);
    var fileContents = fs.readFileSync(file, 'utf8');
    if (isPebbleControl) {
      doc.set(setInDocPath, new pebble.Pebble(xml2json(fileContents)));
    } else {
      doc.setMarkup(setInDocPath, fileContents);
    }
    doc.setValue(pathPath, file);
    doc.setValue('ext', ext);
  }
}

function compressPebbleControls(controlsPath, lib, setInLibPath) {

  var path = p.join(basePath, controlsPath);
  if (fs.existsSync(path)) {
    var files = fs.readdirSync(path);
    files.forEach(function(controlName) {

      console.log(controlName);
      var doc = lib.getCreateOnNull(setInLibPath + '.' + controlName);
      var controlDirPath = p.join(path, controlName);
      if (fs.statSync(controlDirPath).isDirectory()) {
        // base file
        var filePath = p.join(controlDirPath, controlName + '.xml');
        var fileContents = fs.readFileSync(filePath, 'utf8');
        doc.set('.', new pebble.Pebble(xml2json(fileContents)));

        // functions
        var functionsPath = p.join(controlDirPath, 'functions');
        if (fs.existsSync(functionsPath)) {
          console.log('--- functions ---');
          var functions = fs.readdirSync(functionsPath);
          functions.forEach(function(funcFile) {
            console.log(funcFile);
            var funcName = funcFile.split('.')[0];
            var funcDoc = lib.getCreateOnNull(setInLibPath + '_' + controlName + '_functions.' + funcName);
            var funcPath = p.join(functionsPath, funcFile);
            var funcContents = fs.readFileSync(funcPath, 'utf8');
            funcDoc.set('.', new pebble.Pebble(xml2json(funcContents)));
          });
        }
      } 
    });
  }
}

function compressAccessPoints(accessPointsPath, lib, setInLibPath) {

  var path = p.join(basePath, accessPointsPath);
  if (fs.existsSync(path)) {
    var files = fs.readdirSync(path);
    files.forEach(function(accessPointName) {

      console.log(accessPointName);
      var doc = lib.getCreateOnNull(setInLibPath + '.' + accessPointName);
      var accessPointDirPath = p.join(path, accessPointName);
      if (fs.statSync(accessPointDirPath).isDirectory()) {
        // base file
        var filePath = p.join(accessPointDirPath, accessPointName + '.xml');
        if (fs.existsSync(filePath)) {
          var fileContents = fs.readFileSync(filePath, 'utf8');
          doc.set('.', new pebble.Pebble(xml2json(fileContents)));
        }

        // topControl
        var topControlPath = p.join(accessPointDirPath, 'topControl.xml');
        if (fs.existsSync(topControlPath)) {
          var fileContents = fs.readFileSync(topControlPath, 'utf8');
          doc.set('topControl', new pebble.Pebble(xml2json(fileContents)));
        }

        // config
        var configPath = p.join(accessPointDirPath, 'config.json');
        if (fs.existsSync(configPath)) { 
          var configContents = fs.readFileSync(configPath, 'utf8');
          doc.setMarkup('config', configContents);
        }
      } 
    });
  }
}

function processStringMaps(stringMapsPath, lib, setInLibPath) {

  if (stringMapsPath) { 
    var path = p.join(basePath, stringMapsPath);
    if (fs.existsSync(path)) {
      var files = fs.readdirSync(path);

      files.forEach(function(file) {
        console.log(file);
        var fileName = file.split('.')[0];
        var doc = lib.getCreateOnNull(setInLibPath + '.' + fileName);
        var filePath = p.join(path, file);
        var stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          // dir with string files
          console.log('--- strings ---');
          //this could be **/*.less, **/*.scss 
          var strings = fs.readdirSync(filePath);
          strings.forEach(function(stringFile) {
            console.log(stringFile);
            var stringFileName = stringFile.split('.')[0];
            var stringFilePath = p.join(filePath, stringFile);
            var string = fs.readFileSync(stringFilePath, 'utf8');
            doc.setMarkup(stringFileName, string);
          });
        } else if (stat.isFile()) {
          //stringMap file
          //var fileContents = fs.readFileSync(filePath, 'utf8');
          //doc.set(setInDocPath, new pebble.Pebble(xml2json(fileContents)));
        } 
      });
    }
  }
}
function processCssTemplates(cssPath, lib, setInLibPath) {
  if (cssPath) { 
    var path = p.join(basePath, cssPath);
    if (fs.existsSync(path)) {
      var files = fs.readdirSync(path);

      files.forEach(function(file) {
        console.log(file);
        var fileName = file.split('.')[0];
        var doc = lib.getCreateOnNull(setInLibPath + '.' + fileName);
        var filePath = p.join(path, file);
        var stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          // dir with less files
          console.log('--- less ---');
          //this could be **/*.less, **/*.scss 
          var less = fs.readdirSync(filePath);
          less.forEach(function(lessFile) {
            console.log(lessFile);
            var lessFileName = lessFile.split('.')[0];
            var lessFilePath = p.join(filePath, lessFile);
            var lessFileContents = fs.readFileSync(lessFilePath, 'utf8');
            doc.setMarkup('less.' + lessFileName, lessFileContents);
          });
        } else if (stat.isFile()) {
          //css file
          var fileContents = fs.readFileSync(filePath, 'utf8');
          console.log(fileContents);
          doc.setMarkup('css', fileContents);
        } 
      });
    }
  }
}

function bundlePebbleProject(gruntRef, data) {
  
  grunt = gruntRef;
 
  basePath = process.cwd();

  //build deployment
  pebble.Pebble.setDataSourceFactory(new PebbleDataSourceImpl_Json());
  var instancePath = 'theModel_appInstances.theInstance'; 
  var fileName = data.outputFile || 'compressed.json';
  //get rid of directory paths
  if (fileName.indexOf('/') !== -1) {
    fileName = fileName.split('/').pop();
  }
  var lib = new pebble.Pebble(fileName.split('.')[0]);

  //main configPath
  console.log('\n----- theInstance -----');
  var config = fs.readFileSync(p.join(basePath, 'theInstance.xml'), 'utf-8');
  lib.set(instancePath, new pebble.Pebble(xml2json(config)));
  
  //------ appInstance start
  //clientFiles
  console.log('\n----- clientFiles -----');
  compressGlob(['frontend/src/*.js'], lib, 'devCode', instancePath + '.clientScripts', 'path');
  
  //clientTestFiles
  console.log('\n----- clientTestFiles -----');
  compressGlob(['frontend/test/*.js'], lib, 'testCode', instancePath + '.clientScripts', 'path');

  //accessPoints
  console.log('\n----- accessPoints -----');
  compressAccessPoints('frontend/accessPoints', lib, instancePath + '.deployment.accessPoints');

  //cssTemplates
  console.log('\n----- cssTemplates -----');
  processCssTemplates('frontend/cssTemplates', lib, instancePath + '.cssTemplates');

  //stringMaps
  console.log('\n----- stringMaps -----');
  processStringMaps('frontend/stringMaps', lib, instancePath + '.stringMaps');

  //serverFiles
  console.log('\n----- serverFiles -----');
  compressGlob(['server/src/*.js'], lib, 'devCode', instancePath + '.serverScripts', 'path');

  //serverTestFiles
  console.log('\n----- serverTestFiles -----');
  compressGlob(['server/test/*.js'], lib, 'testCode', instancePath + '.serverScripts', 'path');
  //------ appInstance end

  //templatefiles
  console.log('\n----- controls -----');
  compressPebbleControls('frontend/controls', lib, 'theModel_controls');

  //templateCodeFiles
  console.log('\n----- templateCodeFiles -----');
  compressGlob(['frontend/src/controls/*.js'], lib, 'code', 'theModel_controls', 'path');

  //templateTestFiles
  console.log('\n----- templateTestFiles -----');
  compressGlob(['frontend/test/controls/*.js'], lib, 'testCode', 'theModel_controls', 'path');

  //types
  console.log('\n----- types -----');
  compressGlob(['frontend/types/*.xml'], lib, '.', 'theModel_types', 'path', true);
  
  //services
  console.log('\n----- services -----');
  compressGlob(['server/services/*.xml'], lib, '.', 'theModel_services', 'path', true);
  
  fs.writeFileSync(data.outputFile || 'compressed.json', lib.toString(), 'utf8');
}

function bundleOtherProject(gruntRef, data) {

  grunt = gruntRef;

  basePath = process.cwd();

  //build deployment
  pebble.Pebble.setDataSourceFactory(new PebbleDataSourceImpl_Json());
  var instancePath = 'theModel_appInstances.theInstance'; 
  var fileName = data.outputFile || 'compressed.json';
  var lib = new pebble.Pebble(fileName.split('.')[0]);

  //main configPath
  console.log('\n----- configPath -----');
  if (data.configPath) {
    var config = fs.readFileSync(p.join(basePath, data.configPath), 'utf-8');
    lib.setMarkup(instancePath + '.config', config);
  }

  //------ appInstance start
  //clientFiles
  console.log('\n----- clientFiles -----');
  compressGlob(data.clientFiles, lib, 'devCode', instancePath + '.clientScripts', 'codePath');
  
  //clientTestFiles
  console.log('\n----- clientTestFiles -----');
  compressGlob(data.clientTestFiles, lib, 'testCode', instancePath + '.clientScripts', 'testCodePath');

  //accessPoints 
  console.log('\n----- accessPoint configs -----');
  compressGlob(data.accessPoints, lib, 'config', instancePath + '.deployment.accessPoints', 'configPath');

  //access point views (html)
  console.log('\n----- viewFiles -----');
  compressGlob(data.viewFiles, lib, 'htmlpage', instancePath + '.deployment.accessPoints', 'viewPath');

  //cssTemplates
  console.log('\n----- cssTemplates -----');
  processCssTemplates(data.cssTemplates, lib, instancePath + '.cssTemplates');

  //stringMaps
  console.log('\n----- stringMaps -----');
  processStringMaps(data.stringMaps, lib, instancePath + '.stringMaps');

  //serverFiles
  console.log('\n----- serverFiles -----');
  compressGlob(data.serverFiles, lib, 'devCode', instancePath + '.serverScripts', 'codePath');

  //serverTestFiles
  console.log('\n----- serverTestFiles -----');
  compressGlob(data.serverTestFiles, lib, 'testCode', instancePath + '.serverScripts', 'testCodePath');
  //------ appInstance end

  //templateFiles
  console.log('\n----- templateFiles -----');
  compressGlob(data.templateFiles, lib, 'template', 'theModel_controls', 'templatePath');

  //templateCodeFiles
  console.log('\n----- templateCodeFiles -----');
  compressGlob(data.templateCodeFiles, lib, 'code', 'theModel_controls', 'codePath');

  //templateTestFiles
  console.log('\n----- templateTestFiles -----');
  compressGlob(data.templateTestFiles, lib, 'testCode', 'theModel_controls', 'testCodePath');

  //otherFiles
  console.log('\n----- otherFiles -----');
  compressGlob(data.otherFiles, lib, 'contents', 'theModel_otherFiles', 'path');


  fs.writeFileSync(data.outputFile || 'project-bundle.json', lib.toString(), 'utf8');

} 

module.exports.bundlePebbleProject = bundlePebbleProject;
module.exports.bundleOtherProject = bundleOtherProject;
