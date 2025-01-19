const readdir = require('node:fs/promises');
const fs = require('fs');
const path = require('path');

const secretFolder = path.resolve(__dirname, 'secret-folder');
readdir.readdir(
  secretFolder,
  {
    withFileTypes: true,
  },
).then((files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      const fileName = file.name;
      const fileExt = path.extname(fileName);

      fs.stat(path.join(secretFolder, fileName), (error, stats) => {
        const output = (error) ? `Error: ${error}` : `${fileName.split('.')[0]} - ${fileExt.split('.')[1]} - ${stats.size}b`;
        console.log(output);
      });
    }
  });
})
  .catch(
    (e) => console.log(`Error: ${e}`),
  );