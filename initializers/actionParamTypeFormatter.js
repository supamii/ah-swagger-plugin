/**
 * Middleware to support `type` property in an action's inputs definition
 *
 * @Author: Guan Gui <guiguan>
 * @Date:   2016-08-29T13:41:40+10:00
 * @Email:  root@guiguan.net
 * @Last modified by:   guiguan
 * @Last modified time: 2016-08-30T16:59:18+10:00
 */



module.exports = {
  initialize: function(api, next) {
    // set action middleware
    var middleware = {
      name: 'ah-swagger-material-ui',
      global: true,
      preProcessor: function(data, next) {
        var inputs = data.actionTemplate.inputs;
        for (var p of Object.keys(inputs)) {
          var input = inputs[p];
          if (!input.hasOwnProperty('formatter') && input.hasOwnProperty('type') && data.params.hasOwnProperty(p) && (typeof data.params[p] !== input.type)) {
            console.log(input.type);
            switch (input.type) {
              case 'string':
                {
                  data.params[p] = String(data.params[p]);
                  return next();
                }
              case 'boolean':
                {
                  var param = data.params[p];
                  if (typeof param === 'string') {
                    data.params[p] = param === 'true';
                  } else {
                    data.params[p] = Boolean(param);
                  }
                  return next();
                }
              case 'number':
                {
                  data.params[p] = Number(data.params[p]);
                  return next();
                }
              case 'object':
                {
                  data.params[p] = Object(data.params[p]);
                  return next();
                }
              default:
                return next(new Error('Unsupported param type: ' + input.type));
            }
          }
        }
        next();
      }
    }

    api.actions.addMiddleware(middleware);

    next();
  }
};
