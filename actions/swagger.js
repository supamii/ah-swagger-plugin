/**
 * @Author: Guan Gui <guiguan>
 * @Date:   2016-08-23T23:24:05+10:00
 * @Email:  root@guiguan.net
 * @Last modified by:   guiguan
 * @Last modified time: 2016-08-29T19:02:25+10:00
 */



exports.swagger = {
  name: 'swagger',
  description: 'Returns Swagger JSON',
  summary: 'Swagger Data',
  responseSchemas: {
    '200': {
      description: 'Sample response',
      schema: {
        type: 'object',
        properties: {
          'swagger': {
            type: 'string',
            example: 'Swagger 2.0'
          }
        }
      }
    }
  },
  inputs: {
    secure: {
      description: 'Whether to use https',
      required: false,
      type: 'boolean',
      default () {
        return false;
      }
    },
    dev: {
      description: 'Enable dev mode so that each Swagger JSON query will trigger an API doc rebuild',
      required: false,
      type: 'boolean',
      default () {
        return false;
      }
    }
  },
  run: function(api, data, next) {
    if (data.params.dev) {
      // rebuild Swagger JSON
      api.swagger.build();
    }

    data.response = api.swagger.documentation;

    if (data.params.secure) {
      data.response.schemes = ['https'];
    } else {
      data.response.schemes = ['http'];
    }

    next();
  }
};
