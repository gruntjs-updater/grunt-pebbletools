# grunt-pebbletools [![Build Status](https://travis-ci.org/rt/grunt-pebbletools.png)](https://travis-ci.org/rt/grunt-pebbletools)

> tools for pebble projects. [pebblefields](http:pebblefields.com)

## Getting Started

TODO ...

```shell
npm install grunt-pebbletools --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-pebbletools');
```

## The "pebbletools" task

### Overview
In your project's Gruntfile, add a section named `pebbletools` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  pebbletools: {
    options: {
      // Task-specific options go here.
    },
    deploy: {
      outputTemplates: ['path/to/template/_file'], //the file must start with '_', deploy will create the output file without the '_'
    },
    compress: {
      outputTemplates: ['path/to/template/_file'], //the file must start with '_', deploy will create the output file without the '_'
    },
    extract: {
      outputTemplates: ['path/to/template/_file'], //the file must start with '_', deploy will create the output file without the '_'
    },
    compile: {

    },
    setup: {
      
    },
    json2xml: {
      input: 'input/file.json',
      output: 'output/file.json'
    },
    xml2json: {
      input: 'input/file.json',
      output: 'output/file.json'
    },
    prettify: {
      input: 'input/file.json',
      output: 'output/file.json',
      mode: 'json' //json, xml, sql, css
    },
    minify: {
      input: 'input/file.json',
      output: 'output/file.json',
      mode: 'json' //json, xml, sql, css
    },
    changeSpec: {
      input: 'input/file.json',
      output: 'output/file.json',
      tableFilter: function(table) {
        var name = table.getTagName();
        if (name === 'theModel_ ....') {
          return table;
          }
      },
      changePeb: function (peb, data) {

        //do something with peb
      	var longRef = peb.getRef(".");
        if (longRef && longRef.indexOf("theModel") != -1) {
          var newRef = longRef.replace("theModel", "wootwoot");
          peb.setRef(".", newRef);
        }

        //optionally, do children
        var recs = peb.getRecords(".");
        for (var i = 0; i < recs.length; i++) {
          var rec = recs[i];
          data.changePeb(rec, data);
        }
      }
    }
  },
});
```

### Options


## Release History


_(Nothing yet)_
