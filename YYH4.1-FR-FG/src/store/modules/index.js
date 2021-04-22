const files = require.context('.', false, /\.js$/)

let configModules = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  configModules[key.substring(2,key.length-3)] = files(key).default
})

export default configModules