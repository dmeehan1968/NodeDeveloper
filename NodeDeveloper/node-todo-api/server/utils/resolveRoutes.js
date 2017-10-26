const fs = require('fs');
const path = require('path');

function resolveRoutes(folder, uri = [path.sep]) {

  const readdir = (folder) => {
    return new Promise((resolve, reject) => {
      fs.readdir(folder, (err, files) => {
        if (err) return reject(err);
        resolve(files.map((file) => path.resolve(folder, file)));
    });
  })};

  const stat = (file) => {
    return new Promise((resolve, reject) => {
      fs.stat(file, (err, stat) => {
        if (err) return reject(err);
        resolve(stat);
      });
    });
  };

  const flatten = (array) => Array.prototype.concat.apply([], array);

  return readdir(folder).then((files) => {
    return Promise.all(files.map((file) => {
      return stat(file).then((stat) => {
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
      })
    }));
  }).then(flatten);

}

module.exports = {
  resolveRoutes
};
