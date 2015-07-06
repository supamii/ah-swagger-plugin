# ah-swagger-plugin
Generate Swagger-UI documentation from Actionhero

***
**[NPM](https://www.npmjs.com/package/ah-swagger-plugin) | [GitHub](https://github.com/supamii/ah-swagger-plugin)**
***

[![NPM](https://nodei.co/npm/ah-swagger-plugin.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ah-swagger-plugin/)

## Install

- `npm install ah-swagger-plugin --save`

Be sure to specify the location of the installed plugin in /config/api.js

For example, if you list ah-swagger-plugin as an NPM dependency you can point directly to node_modules:

```javascript
// ...
// configuration for your actionhero project structure
paths: {
  //... 
  'plugin': [ __dirname + '/../node_modules' ]
},
```

## Setup

As we do for all Actionhero plugins, add an entry 'ah-swagger-plugin' to /config/plugins.js

```javascript
exports['default'] = {
  general: function(api)
  {
    return {
      plugins: [
        // ...
        'ah-swagger-plugin'
        
      ]
    };
  }
};
```

For more information, checkout the [Actionhero docs](http://www.actionherojs.com/docs/core/plugins.html).

## Configuration

To override default configurations, define the namespace api.config.swagger:

```javascript
exports['default'] = { 
  swagger: function(api){
    return {
      // Should be changed to hit www.yourserver.com
      baseUrl: '127.0.0.1',
      // Specify routes that don't need to be displayed
      ignoreRoutes: [ '/swagger' ],
      // Specify how routes are grouped
      routeTags : {
        'basics' : [ 'showDocumentation', 'status' ]
      },
      // Generate documentation for simple actions specified by action-name
      documentSimpleRoutes: true,
      // Generate documentation for actions specified under config/routes.js
      documentConfigRoutes: true,
      // Set true if you want to organize actions by version
      groupByVersionTag: true,
      // For simple routes, groups all actions under a single category
      groupBySimpleActionTag: true
    }
  }
}
```

## Overview
This plugin will create an end-point that analyzes your Actionhero routes and provides JSON for swagger to consume.

For simplicity, a default swagger.html is provided under the default ./public/ folder.  Contents are directly from the pre-compiled swagger-ui package.

Below is an example of how an action can be defined:

```javascript
exports.myAction = {
  name: 'myAction',
  summary: 'A simple summary of my action',
  description: 'A detailed description of my action.',
  inputs: {
    required: [ 'myParam' ],
    // Each input parameter needs to be defined as a property, including input parameters for routes.
    myParam: {
      description: 'A detailed description of myParam',
      required: true,
      // Define this as an enum if you want to specify the list of possible values.
      enum: [ 'value1', 'value2', 'value3' ]
    }
  },
  // For the body of a post/put, specify example output.
  modelSchema: {
    myParam: {
      type: 'string',
      example: 'value1'
    },
    otherData: {
      type: 'string',
      example: '-data1'
    }
  },
  // A tag will group/organize actions together
  tags: [ 'Examples' ],
  run: function(api, data, next) {
    next();
  }
};
```

LIMITATIONS:
* Using an API key with a file-multiform-upload doesn't work as expected

TODOs:

* Make swagger html files optional or easily over-ridden
* Follow up to see how swagger will honor the 'required' param type
* Include tests

## Credits

Props go out to [@BoLaMN](https://github.com/BoLaMN) for laying the ground work on cracking the translation between Swagger and Actionhero.


## License
The MIT License (MIT)

Copyright (c) 2015 Son-Huy Pham

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

