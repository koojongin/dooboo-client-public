const fs = require('fs')
const path = require('path')
// const dir = 'C:\\Users\\koo\\Downloads\\cc'
const dir = 'C:\\Users\\koo\\Downloads\\새 폴더 (6)'
fs.readdirSync(dir).forEach((filename, index) => {
  const filePath = path.resolve(dir, filename)
  let lowerName = filePath
    .toLowerCase()
    .split('/')
    .pop()
    .replace('.crdownload', '')
    .replace('_icon', '')
  lowerName = path.resolve(
    dir,
    `qwak-cheol_${(index + '').padStart(3, '0')}.webp`,
  )
  console.log(lowerName)
  fs.rename(filePath, lowerName, () => {})
})

/*
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
*/
