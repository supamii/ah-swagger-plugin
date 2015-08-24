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
      required: false
    }
  },
  run: function(api, data, next) {
    // Built by the swagger initializer.
    data.response = api.swagger.documentation;

    // Allows us to toggle on the swagger docs an support http vs https.
    if (data.params.secure && (data.params.secure === true || data.params.secure === 'true')) {
      data.response.schemes = [ 'https' ];
    }
    next();
  }
};
