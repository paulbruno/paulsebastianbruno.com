var fs = require('fs');
var path = require('path');

function getView(baseFilePath, urlPath, extension) {
  if (fs.existsSync(path.join(baseFilePath, urlPath + '.' + extension))) {
    return urlPath;
  } else if (fs.existsSync(path.join(baseFilePath, urlPath, 'index.' + extension))) {
    return path.join(urlPath, 'index');
  } else {
    return false;
  }
}

module.exports = {
  getView,
};
