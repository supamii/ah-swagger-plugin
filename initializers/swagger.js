module.exports = {
  loadPriority: 1000,
  initialize: function(api, next) {
    var config = api.config;
    var actions = api.actions.actions;

    var actionUrl = 'api';
    var serverIp = api.utils.getExternalIPAddress();
    var serverPort = null;

    if (config.servers.web) {
      serverPort = config.servers.web.port;
      actionUrl = config.servers.web.urlPathForActions;
    }

    if (config.swagger.hostOverride) {
      serverIp = config.swagger.hostOverride;
    }

    if (config.swagger.portOverride) {
      serverPort = config.swagger.portOverride;
    }

    var buildPath = function(route, action, parameters, tags) {
      var operationId = route ? route.action : action.name;
      var info = {
        summary: action.summary || '',
        description: action.description || '',
        operationId: operationId,
        parameters: parameters,
        tags: (Array.isArray(tags) && tags.length > 0 ? tags : undefined)
      };
      if (action.responseSchemas && typeof action.responseSchemas !== 'undefined') {
        // TODO: We'll assign the whole thing, but there are swagger bugs/limitations with inline
        // schemas so we'll have to think of an elegant way to reference schemas instead if we 
        // want to demonstrate multiple types of responses e.g. 300's, 400's, etc.
        info.responses = action.responseSchemas;
      }
      return info;
    };

    api.swagger = {
      documentation: {
        swagger: '2.0',
        info: {
          title: config.general.serverName,
          description: config.general.welcomeMessage,
          version: "" + config.general.apiVersion
        },

        host: config.swagger.baseUrl || (serverIp + ':' + serverPort),
        //actionPath: '/' + (actionUrl || 'swagger'),
        basePath: '/' + (actionUrl || 'swagger'),
        schemes: [ 'http' ],
        consumes: [ 'application/json' ],
        produces: [ 'application/json' ],
        paths: {},
        definitions: {},
        parameters: {
          apiVersion: {
            name: 'apiVersion',
            "in": 'path',
            required: true,
            type: 'string'
          }
        }
      },
      build: function() {
        var verbs = api.routes.verbs;

        for ( var actionName in actions) {
          for ( var version in actions[actionName]) {

            var action = actions[actionName][version];
            var parameters = [];
            var required = [];
            var tags = action.tags || [];
            var params = {};

            var definition = api.swagger.documentation.definitions[action.name] = {
              properties: {}
            };

            if (config.swagger.documentSimpleRoutes === false) {
              continue;
            }

            // TODO: Should leverage some stuff done below.

            for ( var key in action.inputs) {
              if (key == 'required' || key == 'optional') {
                continue;
              }
              var input = action.inputs[key];
              api.swagger.documentation.parameters['action_' + action.name + version + "_" + key] = {
                name: key,
                "in": input.paramType || 'query',
                type: input.dataType || 'string',
                enum: input.enum || undefined,
                description: input.description || undefined,
                required: input.required
              };
              parameters.push({
                $ref: "#/parameters/action_" + action.name + version + "_" + key
              });
              definition.properties[key] = {
                type: 'string'
              };
              if (input.required) {
                required.push(key);
              }
            }

            if (required.length > 0) {
              definition.required = required;
            }

            for ( var key in action.headers) {
              var input = action.headers[key];
              api.swagger.documentation.parameters['action_' + action.name + version + "_" + key] = {
                name: key,
                "in": 'header',
                type: 'string',
                enum: input.enum || undefined,
                description: input.description || undefined,
                required: input.required
              };
              parameters.push({
                $ref: "#/parameters/action_" + action.name + version + "_" + key
              });
              definition.properties[key] = {
                type: 'string'
              };
              if (input.required) {
                required.push(key);
              }
            }

            if (required.length > 0) {
              definition.required = required;
            }

            if (config.swagger.groupBySimpleActionTag) {
              tags.push('actions');
            }

            if (config.swagger.groupByVersionTag) {
              tags.push(version);
            }

            api.swagger.documentation.definitions[action.name + version] = {
              type: 'object',
              properties: action.modelSchema
            };

            if (!api.swagger.documentation.paths["/" + action.name]) {
              api.swagger.documentation.paths["/" + action.name] = {};
            }

            for (var k = 0, len = verbs.length; k < len; k++) {

              var method = verbs[k];

              var params = [];
              parameters.forEach(function(p) {
                params.push(p);
              });

              switch (method.toLowerCase()) {
                case 'put':
                case 'post':
                  if (action.modelSchema) {
                    params.push({
                      name: 'body',
                      "in": 'body',
                      description: 'Body of the post/put action',
                      schema: {
                        $ref: "#/definitions/action_" + action.name + version
                      }
                    });
                  } else {
                    params.push({
                      name: 'body',
                      "in": 'body',
                      description: 'Body of the post/put action',
                      schema: {
                        type: 'object'
                      }
                    });
                  }
                  break;
                default:
                  break;
              }

              api.swagger.documentation.paths["/" + action.name][method] = buildPath(null, action, params, tags);
            }
          }
        }

        if (config.routes && config.swagger.documentConfigRoutes !== false) {
          for ( var method in config.routes) {
            var routes = config.routes[method];
            for (var l = 0, len1 = routes.length; l < len1; l++) {
              var route = routes[l];

              var shouldSkip = false;
              for (var i = 0; i < config.swagger.ignoreRoutes.length; ++i) {
                shouldSkip = (route.path.indexOf(config.swagger.ignoreRoutes[i]) >= 0)
                if (shouldSkip)
                  break;
              }
              if (shouldSkip)
                continue;

              var actionByVersion = actions[route.action];
              for ( var version in actionByVersion) {

                var action = actionByVersion[version];
                var parameters = [];
                var required = [];

                var tags = action.tags || [];
                for ( var i in config.swagger.routeTags) {
                  for ( var r in config.swagger.routeTags[i]) {
                    if (route.path.indexOf(config.swagger.routeTags[i][r]) > 0) {
                      tags.push(i);
                      break;
                    }
                  }
                }

                if (config.swagger.groupByVersionTag) {
                  tags.push(version);
                }

                // This works well for simple query paths etc, but we need some additional checks
                // for any routes since a lot of parameters may overlap.

                var params = {};

                var path = route.path.replace(/\/:([\w]*)/g, function(match, p1) {
                  if (p1 === 'apiVersion') {
                    return '/' + version;
                  }
                  // If p1 (the parameter) is already included in the path, skip it since it'll
                  // be handled in the route-centric format anyway.
                  if (typeof action.inputs[p1] !== 'undefined' && action.inputs[p1] !== null) {
                    params[p1] = true;
                    return "/{" + p1 + "}";
                  }

                  parameters.push({
                    $ref: "#/parameters/" + route.action + version + "_" + p1 + "_path"
                  });
                  api.swagger.documentation.parameters[route.action + version + "_" + p1 + "_path"] = {
                    name: p1,
                    "in": 'path',
                    type: 'string'
                  };
                  return "/{" + p1 + "}";
                });

                if (!api.swagger.documentation.paths["" + path]) {
                  api.swagger.documentation.paths["" + path] = {};
                }

                for ( var key in action.inputs) {
                  if (key == 'required' || key == 'optional') {
                    continue;
                  }
                  var input = action.inputs[key];

                  // Unlike simple routes above, we'll need to distinguish between a path type
                  // (param for url portion) and then a query type (param for query string).

                  var paramType = input.paramType || (params[key] ? 'path' : 'query');
                  var paramStr = route.action + version + "_" + paramType + "_" + key;

                  api.swagger.documentation.parameters[paramStr] = {
                    name: key,
                    "in": input.paramType || (params[key] ? 'path' : 'query'),
                    type: input.dataType || 'string',
                    enum: input.enum || undefined,
                    description: input.description || undefined,
                    required: input.required
                  };
                  parameters.push({
                    $ref: "#/parameters/" + paramStr
                  });
                  definition.properties[key] = {
                    type: 'string'
                  };
                  if (input.required) {
                    required.push(key);
                  }
                }

                if (required.length > 0) {
                  definition.required = required;
                }

                for ( var key in action.headers) {
                  var input = action.headers[key];
                  api.swagger.documentation.parameters[route.action + version + "_" + key] = {
                    name: key,
                    "in": 'header',
                    type: 'string',
                    enum: input.enum || undefined,
                    description: input.description || undefined,
                    required: input.required
                  };
                  parameters.push({
                    $ref: "#/parameters/" + route.action + version + "_" + key
                  });
                  definition.properties[key] = {
                    type: 'string'
                  };
                  if (input.required) {
                    required.push(key);
                  }
                }

                if (required.length > 0) {
                  definition.required = required;
                }

                api.swagger.documentation.definitions[action.name + version] = {
                  type: 'object',
                  properties: action.modelSchema
                };

                switch (method.toLowerCase()) {
                  case 'put':
                  case 'post':
                    if (action.modelSchema) {
                      parameters.push({
                        name: 'body',
                        "in": 'body',
                        description: 'Body of the post/put action',
                        schema: {
                          $ref: "#/definitions/" + action.name + version
                        }
                      });
                    } else {
                      parameters.push({
                        name: 'body',
                        "in": 'body',
                        description: 'Body of the post/put action',
                        schema: {
                          type: 'object'
                        }
                      });
                    }
                    break;
                  default:
                    break;
                }

                if (method.toLowerCase() === 'all') {
                  var verbsLength = verbs.length
                  for (var m = 0, verbsLength; m < verbsLength; m++) {
                    api.swagger.documentation.paths["" + path][verbs[m]] = buildPath(route, action, parameters, tags);
                  }
                } else {
                  api.swagger.documentation.paths["" + path][method] = buildPath(route, action, parameters, tags);
                }
              }
            }
          }
        }
      }
    };
    next();
  },

  start: function(api, next) {
    api.swagger.build();
    next();
  }
};
