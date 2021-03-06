
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
  
  if (accessPointParam) {

      _deploy(grunt, data, app, accessPointParam);

  } else {
    //all
    var accessPoints = app.getRecords('theModel_accessPoints');
    for (var i = 0; i < accessPoints.length; i++) {

      var accessPoint = accessPoints[i];
      _deploy(grunt, data, app.getCopy('.'), accessPoint.getTagName());

    }
  }
}

function _deploy(grunt, data, app, accessPointParam) {

  console.log('INFO: building deployment ...' + accessPointParam);
  //empty ws
  var workspaceDs = new pebble.shared.ServerDataImpl_Xml();

  workspaceDs.addDs('theModel.libs', app);

  var appName = data.app.replace('.json', '');

  //build deployment
  var lib = workspaceDs.retrieve('theModel.libs', appName);
  
  var accessPoint = app.get('theModel_accessPoints.' + accessPointParam);
  var accessPointConfigStr = accessPoint.getValue('config');
  var accessPointConfig = JSON.parse(accessPointConfigStr);
  for (var i = 0; i < accessPointConfig.dependencies.length; i++) {
    var dep = accessPointConfig.dependencies[i];
    var depFilePath = data.dependencies[dep.lib];
    if (depFilePath && dep !== appName) {
      var libStr = fs.readFileSync(p.join(topDir, depFilePath), 'utf-8');
      var lib = new pebble.Pebble(libStr);
      workspaceDs.addDs('theModel.libs', lib);
    }
  }

  pebble.less = less;

  var depObj = new pebble.shared.Deployment();
  depObj.buildDeployment(new pebble.shared.BuildDeployment(less), appName, workspaceDs, accessPointParam, function(accessPointDeployment) {

    grunt.file.write(p.join(topDir, data.output, accessPointParam + '.json'), accessPointDeployment.toString(), {encoding:'utf8'});
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
          grunt.file.write(outputPath, deploymentContents, {encoding:'utf8'});
        } else {
          grunt.log.warn('output template files should start with "_"'); 
        }
      });
    }
  });
}

module.exports = function(gruntRef, data, param1) {
  grunt = gruntRef;
  deploy(grunt, data, param1);

};
