const fs = require(`fs`)
const path = require(`path`)    
    
const icons = path.join(__dirname, `../app/assets/icons`)
const iconsJs = path.join(__dirname, `../app/assets/icons.js`)
const buf = {}
fs.readdirSync(icons).forEach(file => {
  const filePath = path.join(icons, file)
  if (fs.statSync(filePath).isFile() && /.svg$/.test(file)) {
    const data = fs.readFileSync(filePath, {
      encoding: `utf8`
    })
    buf[file.slice(0, -4)] = data
  }
})
fs.writeFileSync(iconsJs, `module.exports = ${JSON.stringify(buf)}`)