/*
 * grunt-pebble
 * 
 *
 * Copyright (c) 2014 rtsunoda
 * Licensed under the MIT license.
 */

var fs = require('fs');
var p = require('path');
var pd = require('pretty-data').pd;
var less = require('less');
var pebble = require('pebble-shared-node').pebble;
var PebbleDataSourceImpl_Json = require('pebble-object-json').PebbleDataSourceImpl_Json;

var topDir = process.cwd();


'use strict';

/**
 * usage:  grunt deploy:full:pebbleDev:pebbleDesktop
 */
function deploy(grunt, data, accessPointParam) {
  //set 
  pebble.Pebble.setDataSourceFactory(new PebbleDataSourceImpl_Json());

  //add app
  var appStr = fs.readFileSync(p.join(topDir, data.app), 'utf-8');
  var app = new pebble.Pebble(appStr);
  
  var deployment = app.get('theModel_appInstances.theInstance.deployment');
  
  if (accessPointParam) {

      _deploy(grunt, data, app, deployment, accessPointParam);

  } else {
    //all
    var accessPoints = deployment.getRecords('accessPoints');
    for (var i = 0; i < accessPoints.length; i++) {

      var accessPoint = accessPoints[i];
      _deploy(grunt, data, app.getCopy('.'), deployment.getCopy('.'), accessPoint.getTagName());

    }
  }
}

function _deploy(grunt, data, app, deployment, accessPointParam) {

  console.log('INFO: building deployment ...' + accessPointParam);
  //empty ws
  var workspaceDs = new pebble.shared.ServerDataImpl_Xml();

  workspaceDs.addDs('theModel.libs', app);

  var appName = data.app.replace('.json', '');

  //build deployment
  var lib = workspaceDs.retrieve('theModel.libs', appName);
  
  var accessPoint = deployment.get('accessPoints.' + accessPointParam);
  var dependencies = accessPoint.getRecords('dependencies');
  for (var i = 0; i < dependencies.length; i++) {
    var dep = dependencies[i];
    var depFilePath = data.dependencies[dep.getRef('.')];
    if (depFilePath && dep !== appName) {
      var libStr = fs.readFileSync(p.join(topDir, depFilePath), 'utf-8');
      var lib = new pebble.Pebble(libStr);
      workspaceDs.addDs('theModel.libs', lib);
    }
  }

  pebble.less = less;

  var depObj = new pebble.shared.Deployment();
  depObj.buildDeployment(new pebble.shared.BuildDeployment(less), workspaceDs, appName, deployment, accessPointParam, function(accessPointDeployment) {

    fs.writeFileSync(p.join(topDir, data.output, accessPointParam + '.json'), accessPointDeployment.toString(), 'utf8');
    if (data.outputTemplates) {
      var files = grunt.file.expand(data.outputTemplates);
      files.forEach(function(filePath) {
        var elements = filePath.split('/');
        var file = elements.pop();
        if (file.indexOf('_') === 0) {
          var filePath = p.join(topDir, elements.join('/'), file);
          var fileContents = fs.readFileSync(filePath, 'utf8');
          var deploymentContents = fileContents.replace('{{' + accessPointParam + '}}', accessPointDeployment.toString());
          var outputPath = p.join(topDir, elements.join('/'), file.replace('_', ''));
          fs.writeFileSync(outputPath, deploymentContents, 'utf8');
        } else {
          grunt.log.warn('output template files should start with "_"'); 
        }
      });
    }
  });
}

module.exports = function(gruntRef, data, param1) {
  grunt = gruntRef;
  grunt.log.write('starting ...');
  deploy(grunt, data, param1);
  grunt.log.write('done.');

};
