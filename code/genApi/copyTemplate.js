/**
 * 将.ejs模板copy到编译目录dist
 * @type {path.PlatformPath | path}
 */
const path = require('path');
const fs = require('fs');

const srcFolder = path.join(__dirname, 'src/tpls');
const distFolder = path.join(__dirname, 'dist/tpls');
if (!fs.existsSync(distFolder)) {
  fs.mkdirSync(distFolder);
}
// 复制所有的静态资源文件
fs.readdirSync(srcFolder)
  .filter(function (file) {
    return ['.ts', '.tsx'].indexOf(path.extname(file)) === -1;
  })
  .forEach(function (file) {
    fs.copyFileSync(path.join(srcFolder, file), path.join(distFolder, file));
  });
