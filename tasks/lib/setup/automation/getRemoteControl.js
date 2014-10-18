#!/usr/bin/env node

var webdriver = require('selenium-webdriver');

//var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
//var server = new SeleniumServer('selenium-server-standalone-2.42.0.jar', {
	//port: 4444
//});
//server.start();

var builder = new webdriver.Builder();

var serverIp = 'localhost';
var browser = 'chrome';

for (var i = 0; i < process.argv.length; i++) {
	var arg = process.argv[i];
	if (arg.indexOf('ip=') == 0) {
		serverIp = arg.split('=')[1];
	} else if (arg.indexOf('browser=') == 0) {
		browser = arg.split('=')[1];
	}
}

builder.usingServer('http://' + serverIp + ':4444/wd/hub');
//builder.usingServer(server.address()).

console.log('SERVER: ' + serverIp);
console.log('BROWSER: ' + browser);

switch (browser) {
	case 'chrome':
    builder.withCapabilities(webdriver.Capabilities.chrome());
		break;
	case 'firefox':
    builder.withCapabilities(webdriver.Capabilities.firefox());
		break;
	case 'ie':
    builder.withCapabilities(webdriver.Capabilities.ie());
		break;
	case 'phantomjs':
    builder.withCapabilities(webdriver.Capabilities.phantomjs());
		break;
	case 'safari':
    builder.withCapabilities(webdriver.Capabilities.safari());
		break;
}

var driver = builder.build();

driver.getSession().then(function(sessionData) {
	var sessionId = JSON.stringify(sessionData).replace(/\"/g, '');
	console.log('SESSION-ID: ' + sessionId);
	driver.get('http://' + serverIp + ':8888/selenium-browser-rc.html?wdurl=http://' + serverIp + ':4444/wd/hub&wdsid=' + sessionId);
});


