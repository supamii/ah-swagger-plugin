#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const projectApiConfigLocation = path.normalize(process.cwd() + '/../../config/api.js')

const localConfigFile = path.normalize(path.join(__dirname, '/../config/swagger.js'))
const projectConfigFile = path.normalize(process.cwd() + '/../../config/swagger.js')

try {
  fs.lstatSync(projectApiConfigLocation)
  // Only run if api config file exists (prevents install whlie in development)
  try {
    fs.lstatSync(projectConfigFile)
  } catch (ex) {
    // Only try to copy the files for fresh installs (prevents overriding config).
    console.log('copying ' + localConfigFile + ' to ' + projectConfigFile)
    fs.createReadStream(localConfigFile).pipe(fs.createWriteStream(projectConfigFile))
  }
} catch (ex) {
  console.log('postinstall script skipped')
}
