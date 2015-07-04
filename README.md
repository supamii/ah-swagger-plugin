# ah-swagger-plugin
Generate Swagger-UI documentation from Actionhero

***
**[NPM](https://www.npmjs.com/package/ah-swagger-plugin) | [GitHub](https://github.com/supamii/ah-swagger-plugin)**
***

## Install

- `npm install ah-swagger-plugin --save`


## Configuration

To override configurations, override values set under api.config.swagger.  Define this in an Actionhero configuration file:

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
This plugin will create an end-point that analyzes your Actionhero routes at runtime and returns JSON for swagger to consume.

For ease of use, a default swagger.html is provided under the default ./public/ folder.

LIMITATIONS:
* Using an API key with a file-multiform-upload doesn't work as expected

TODOs:

* Make swagger html files optional
* Describe swagger fields for each action
* Include more examples for action descriptions
* Include tests

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

