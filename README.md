
[![Gitter](http://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-2DCC76.svg?style=flat)](https://gitter.im/supamii/ah-swagger-plugin?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# ah-swagger-plugin
Generate Swagger-UI documentation from Actionhero

***
**[NPM](https://www.npmjs.com/package/ah-swagger-plugin) | [GitHub](https://github.com/supamii/ah-swagger-plugin) | [Chat](https://gitter.im/supamii/ah-swagger-plugin)**
***

## Install & Setup

- Install this plugin: `npm install ah-swagger-plugin --save`
- Add plugin to your project's `./config/plugins.js`:
```
exports['default'] = {
  plugins: (api) => {
    return {
      'ah-swagger-plugin': { path: __dirname + '/../node_modules/ah-swagger-plugin' }
    }
  }
}
```

## More information

Checkout the [Actionhero docs](https://docs.actionherojs.com/tutorial-plugins.html).

For Actionhero v17 to v13, specify ah-swagger-plugin **v1.0.1** in your package.json - Documentation is captured on github with [tag v1.0.1](https://github.com/supamii/ah-swagger-plugin/tree/v1.0.1)

For Actionhero v12 and below, specify ah-swagger-plugin **v0.0.16** in your package.json - Documentation is captured on github with [tag v0.0.16](https://github.com/supamii/ah-swagger-plugin/tree/v0.0.16)

## Overview
This plugin will create an end-point that analyzes your Actionhero routes and provides JSON for swagger to consume.

For simplicity, a default index.html is provided under the ./public/swagger folder.  Contents are directly from the pre-compiled swagger-ui package.

Below is an example of how an action can be defined:

```javascript
const { Action, api } = require('actionhero')

module.exports = class MyAction extends Action {
  constructor () {
    super()
    this.name = 'myAction'
    this.description = 'A detailed description of my action.'
    this.responseSchemas = {
      // By default set this 200 property to provide a sample response in the form of a JSON schema
      // object.  Since schemas can get pretty bulky, consider requiring a file instead of having
      // everything in-line.  E.g. '200': require('myResponseSchema.js')
      //
      // It's also possible to automate schema generation with json-schema-generator with json-patch.
      '200': {
        description: 'Sample http 200 response',
        schema: {
          type: 'object',
          properties: {
            'marco': {
              type: 'string',
              example: 'polo'
            }
          }
        }
      }
    }
    this.inputs = {
      required: ['myParam'],
      // Each input parameter needs to be defined as a property, including input parameters for routes.
      myParam: {
        description: 'A detailed description of myParam',
        required: true,
        // Define this as an enum if you want to specify the list of possible values.
        enum: ['value1', 'value2', 'value3']
      }
    }
    // For post/put http requests, describing the body is set here in JSON schema form.
    this.modelSchema = {
      myParam: {
        type: 'string',
        example: 'value1'
      },
      otherData: {
        type: 'string',
        example: '-data1'
      }
    }
    // A tag will group/organize actions together
    this.tags = ['Examples']
  }

  async run (data) { }
}
```
- You can access the `http://127.0.0.1:8080/swagger` and see your project's documentation:

![alt tag](https://raw.github.com/supamii/ah-swagger-plugin/master/screenshot.png)

LIMITATIONS:
* Using an API key with a file-multiform-upload doesn't work as expected

TODOs:

* Make swagger html files optional or easily over-ridden
* Include tests

## Advanced Configuration

A `./config/swagger.js` file will be created which will store your configuration.

```javascript
exports.default = {
  swagger: (api) => {
    return {
      // Should be changed to hit www.yourserver.com.  If this is null, defaults to ip:port from
      // internal values or from hostOverride and portOverride.
      baseUrl: '127.0.0.1:8080',
      // Specify routes that don't need to be displayed
      ignoreRoutes: ['/swagger'],
      // Specify how routes are grouped
      routeTags: {
        'basics': ['showDocumentation', 'status']
      },
      // Generate documentation for simple actions specified by action-name
      documentSimpleRoutes: true,
      // Generate documentation for actions specified under config/routes.js
      documentConfigRoutes: true,
      // Set true if you want to organize actions by version
      groupByVersionTag: true,
      // For simple routes, groups all actions under a single category
      groupBySimpleActionTag: true,
      // In some cases where actionhero network topology needs to point elsewhere.  If null, uses
      // api.config.swagger.baseUrl
      hostOverride: null,
      // Same as above, if null uses the internal value set in config/server/web.js
      portOverride: null
    }
  }
}
```

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
