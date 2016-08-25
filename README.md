<!--
@Author: Guan Gui <guiguan>
@Date:   2016-08-23T23:24:05+10:00
@Email:  root@guiguan.net
@Last modified by:   guiguan
@Last modified time: 2016-08-26T08:16:29+10:00
-->



# ah-swagger-material-ui
Generate Beautiful Swagger Material UI Documentation for ActionHero. This work is based on [supamii/ah-swagger-plugin](https://github.com/supamii/ah-swagger-plugin) and [darosh/angular-swagger-ui-material](https://github.com/darosh/angular-swagger-ui-material).

## Install & Setup

- `npm install -S ah-swagger-material-ui`
- run `actionhero link --name=ah-swagger-material-ui` to register the Swagger Plugin in ActionHero v13
  * more information [here](http://www.actionherojs.com/docs/#including-plugins)

Then finally, so the UI can read the swagger data, ensure that the route `GET /api/swagger` is configured to point to the `swagger` action.
```js
// config/routes.js
exports.default = {
  routes: function(api){
    return {
      get: [
        { path: '/swagger', action: 'swagger' }
      ]
    }
  }
};
```

## Overview
This plugin will analyse ActionHero routes, generate Swagger JSON, and display the JSON in a beautiful Swagger material ui.

Below is an example of how an action can be defined:

```javascript
exports.myAction = {
  name: 'myAction',
  summary: 'A simple summary of my action',
  description: 'A detailed description of my action.',
  responseSchemas: {
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
  },
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
  // For post/put http requests, describing the body is set here in JSON schema form.
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
- The Swagger material ui can be accessed at `http://127.0.0.1:8080/public/swagger`

![alt tag](https://raw.github.com/guiguan/ah-swagger-material-ui/master/screenshot.png)

## Advanced Configuration

To override default configurations, define the namespace api.config.swagger:

```javascript
exports['default'] = {
  swagger: function(api){
    return {
      // Should be changed to hit www.yourserver.com.  If this is null, defaults to ip:port from
      // internal values or from hostOverride and portOverride.
      baseUrl: '127.0.0.1:8080',
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

## Limitations

* Using an API key with a file-multiform-upload doesn't work as expected
* `api.config.web.rootEndpointType` has to be configured as `file` in order for the UI to function correctly

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
