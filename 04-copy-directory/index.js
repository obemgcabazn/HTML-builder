const fs = require('fs/promises');
const path = require('path');

const destinationPath = path.resolve(__dirname, 'files-copy');
const sourcePath = path.resolve(__dirname, 'files');

async function copyFolder(from, to) {
  try {
    await fs.rm(to, {
      recursive: true,
      force: true,
    });

    await fs.mkdir(to, {
      recursive: true,
    });

    const entries = await fs.readdir(from, {
      withFileTypes: true,
    });

    for (let entry of entries) {
      const srcPath = path.resolve(from, entry.name);
      const destPath = path.resolve(to, entry.name);

      if (entry.isFile()) {
        await fs.copyFile(srcPath, destPath);
      } else if (entry.isDirectory()) {
        await fs.cp(srcPath, destPath, { recursive: true });
      }
    }
  } catch (error) {
    console.error('Error copying folder:', error);
    throw error;
  }
}

copyFolder(sourcePath, destinationPath);