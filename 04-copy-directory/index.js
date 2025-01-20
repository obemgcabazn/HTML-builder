const fs = require('fs/promises');
const path = require('path');

const sourcePath = path.resolve(__dirname, 'files-copy');
const destinationPath = path.resolve(__dirname, 'files');

async function copyFolder() {
  await fs.rm(sourcePath, {
    recursive: true,
    force: true,
  });

  await fs.mkdir(sourcePath, {
    recursive: true,
  });

  const copyFiles = await fs.readdir(destinationPath, {
    withFileTypes: true,
  });

  for (let file of copyFiles) {

    if (file.isFile()) {
      await fs.copyFile(
        path.resolve(destinationPath, file.name),
        path.resolve(sourcePath, file.name),
      );
    }
  }
}

copyFolder();