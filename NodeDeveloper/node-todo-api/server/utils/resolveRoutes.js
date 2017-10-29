const fs = require('fs');
const path = require('path');

function resolveRoutes(folder, uri = [path.sep]) {

  const flatten = (array) => Array.prototype.concat.apply([], array);

  return flatten(fs.readdirSync(folder).map((file) => {
    file = path.resolve(folder, file);
      let stat = fs.statSync(file)
      const parts = path.parse(file);
      if (stat.isDirectory()) {
        return resolveRoutes(file, uri.concat(parts.name));
      } else {
        return {
          method: parts.name.toUpperCase(),
          module: file,
          uri: path.join(...uri)
        };
      }
    }));

}

module.exports = {
  resolveRoutes
};
