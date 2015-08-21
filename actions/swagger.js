exports.swagger = {
  name: 'swagger',
  description: 'Returns Swagger JSON',
  outputExample: {},
  inputs: {
    isSecure: {
      required: false
    }
  },
  run: function(api, data, next) {
    // Built by the swagger initializer.
    data.response = api.swagger.documentation;

    // Allows us to toggle on the swagger docs an support http vs https.
    if (data.params.isSecure && (data.params.isSecure === true || data.params.isSecure === 'true')) {
      data.response.schemes = [ 'https' ];
    }
    next();
  }
};
