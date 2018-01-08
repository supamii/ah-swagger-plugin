const { Action, api } = require('actionhero')

module.exports = class Swagger extends Action {
  constructor () {
    super()
    this.name = 'swagger'
    this.description = 'Returns Swagger JSON'
    this.inputs = {
      secure: {
        required: false
      }
    }
  }

  async run (data) {
    data.response = api.swagger.documentation

    if (data.params.secure && (data.params.secure === true || data.params.secure === 'true')) {
      data.response.schemes = ['https']
    }
  }
}
