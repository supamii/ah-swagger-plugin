<!--
@Author: Guan Gui <guiguan>
@Date:   2016-08-23T23:24:05+10:00
@Email:  root@guiguan.net
@Last modified by:   guiguan
@Last modified time: 2016-08-30T16:37:23+10:00
-->

[![npm version](https://badge.fury.io/js/ah-swagger-material-ui.svg)](https://badge.fury.io/js/ah-swagger-material-ui)

# ah-swagger-material-ui
Generate Beautiful Swagger Material UI Documentation for ActionHero. This work is based on [supamii/ah-swagger-plugin](https://github.com/supamii/ah-swagger-plugin) and [darosh/angular-swagger-ui-material](https://github.com/darosh/angular-swagger-ui-material).

![screenshot](https://raw.github.com/guiguan/ah-swagger-material-ui/master/screenshot.png)

## Installation & Setup

- `npm install -S ah-swagger-material-ui`
- Run `actionhero link --name=ah-swagger-material-ui` to register the Swagger Plugin in ActionHero 15+. [More details](http://www.actionherojs.com/docs/#including-plugins).
- Make changes in `config/swagger.js` accordingly
- The Swagger material ui can be accessed at `http://127.0.0.1:8080/public/swagger`

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

### Development Mode
Normally, the Swagger API doc will be generated once upon ActionHero start. However, you can enable dev mode so that the doc will be generated upon refresh of Swagger UI:

`http://127.0.0.1:8080/public/swagger?dev=true`

### HTTP Termination
The plugin will set up HTTP termination based on current URL. This will be used to fire up API requests within UI. You can override the termination setting as follows:

`http://127.0.0.1:8080/public/swagger?dev=true&secure=true`

## Usage
This plugin will analyse ActionHero routes, generate Swagger JSON, and display the JSON in a beautiful Swagger material ui.

Below is an example of how an action can be defined:

```javascript
exports.myAction = {
  name: 'myAction',
  summary: 'A simple summary of my action',
  description: 'A detailed description of my action.',
  inputs: {
    // Each input parameter needs to be defined as a property, including input
    // parameters for routes.
    myParam: {
      description: 'A detailed description of myParam',
      // optional, default: false
      required: true,
      // optional, default: string; types in JS `typeof` are available. When no
      // formatter is presented, the param's type will be converted to the
      // correct type automatically. See `actionParamTypeFormatter.js`.
      type: 'string',
      // optional, auto-detect; available options: query, body, header
      in: 'query',
      // optional, default: undefined; define this as an enum if you want to
      // specify the list of possible values
      enum: [ 'value1', 'value2', 'value3' ]
    },
  },
  // optional; a tag will group/organize actions together
  tags: [ 'Examples' ],
  run: function(api, data, next) {
    next();
  }
};
```


## Advanced Configuration

To override default configurations, define the namespace api.config.swagger:

```javascript
var host = process.env.API_HOST || 'localhost';
var port = process.env.API_PORT || 8080;

exports['default'] = {
  swagger: function(api){
    return {
      // Should be changed to hit www.yourserver.com.  If this is null, defaults to ip:port from
      // internal values or from hostOverride and portOverride.
      baseUrl: host + ':' + port,
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
      groupByVersionTag: false,
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

## TODO

- [ ] Properly support Swagger response schema and model schema
- [ ] JWT authentication token support

## License
The MIT License (MIT)

Copyright (c) 2016 Guan Gui, Son-Huy Pham

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
