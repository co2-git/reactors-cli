const Module = require('module');
const fs = require('fs');
const originalResolveFilename = Module._resolveFilename;

// require binary files
Module._resolveFilename = function(moduleName) {
  if (/\.(png|jpe?g)$/.test(moduleName)) {
    const fileName = moduleName.replace(/^\.\./, '.') + '.js';
    // check if file exists
    try {
      fs.statSync(fileName);
    } catch (error) {
      const contents = fs.readFileSync(moduleName.replace(/^\.\./, '.'));
      fs.writeFileSync(
        fileName,
        'module.exports = "data:image/gif;base64,' +
          contents.toString('base64') + '"'
      );
    }
    return fileName;
  }
  return originalResolveFilename.apply(this, arguments);
};
