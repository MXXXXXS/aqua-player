const fs = require(`fs`)
const path = require(`path`)    
    
const components = path.join(__dirname, `../app/components/src`)
const componentsJs = path.join(__dirname, `../app/assets/components.js`)
const buf = {}
fs.readdirSync(components).forEach(file => {
  const filePath = path.join(components, file)
  if (fs.statSync(filePath).isFile() && /.html$/.test(file)) {
    const data = fs.readFileSync(filePath, {
      encoding: `utf8`
    })
    buf[file.slice(0, -5)] = data
  }
})
fs.writeFileSync(componentsJs, `export default ${JSON.stringify(buf)}`)