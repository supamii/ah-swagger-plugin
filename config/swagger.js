/**
 * @Author: Guan Gui <guiguan>
 * @Date:   2016-08-23T23:24:05+10:00
 * @Email:  root@guiguan.net
 * @Last modified by:   guiguan
 * @Last modified time: 2016-08-26T06:49:38+10:00
 */



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
