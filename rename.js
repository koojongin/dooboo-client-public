const fs = require('fs')
const path = require('path')
const dir = 'C:\\Users\\koo\\Downloads\\cc'
// fs.readdirSync(dir).forEach((filename, index) => {
//   const filePath = path.resolve(dir, filename)
//   const lowerName = filePath
//     .toLowerCase()
//     .split('/')
//     .pop()
//     .replace('.png', '.webp')
//     .replace('_icon', '')
//   fs.rename(filePath, lowerName, () => {})
// })

console.log(path.resolve())
const folderPath = path.resolve('public', 'images', 'pickup', 'unit')
fs.readdirSync(folderPath).forEach((filename) => {
  const fullFilePath = path.resolve(folderPath, filename)
  let fixedFileName = filename.replace('.webp', '')
  // let fixedFileName = filename
  //   .replace('_', '-')
  //   .replace('_', '-')
  //   .replace('_', '-')
  // fixedFileName = fixedFileName
  //   .split('-')
  //   .map((word) => {
  //     return word.charAt(0).toUpperCase() + word.slice(1)
  //   })
  //   .join('-')
  // fixedFileName.charAt(0).toUpperCase() + fixedFileName.slice(1)
  console.log(fixedFileName)
  // fs.rename(fullFilePath, path.resolve(folderPath, fixedFileName), () => {})
})
