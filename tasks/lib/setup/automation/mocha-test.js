var webdriver = require('selenium-webdriver');
var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
var assert = require('assert');
var test = require('selenium-webdriver/testing');

var server = new SeleniumServer('selenium-server-standalone-2.42.0.jar', {
  port: 4444
});

server.start();

var driver = new webdriver.Builder().
    usingServer(server.address()).
    withCapabilities(webdriver.Capabilities.firefox()).
    //withCapabilities(webdriver.Capabilities.chrome()).
		//withCapabilities(webdriver.Capabilities.phantomjs()).
		build();

//driver.get('http://localhost:8888/index.html?mode=dev');
driver.get('http://google.com');
//driver.findElement(webdriver.By.name('q')).sendKeys('webdriver');
//driver.findElement(webdriver.By.name('btnG')).click();
//driver.wait(function() {
 //return driver.getTitle().then(function(title) {
	 //return title === 'webdriver - Google Search';
 //});
//}, 1000);
//
test.describe('Google Search', function() {
  test.it('should work', function() {
    //var driver = new webdriver.Builder().build();

    var searchBox = driver.findElement(webdriver.By.name('q'));
    searchBox.sendKeys('webdriver');
    searchBox.getAttribute('value').then(function(value) {
      assert.equal(value, 'webdriver');
    });

		driver.quit();
  });
});


//test.describe('Google Search', function() {
  //test.it('should work', function() {
    ////var driver = new webdriver.Builder().build();

    //var searchBox = driver.findElement(webdriver.By.name('q'));
    //searchBox.sendKeys('webdriver');
    //searchBox.getAttribute('value').then(function(value) {
      //assert.equal(value, 'webdriver');
    //});

		//driver.quit();
  //});
//});


				

				
