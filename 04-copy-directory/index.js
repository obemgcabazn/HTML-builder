const fs = require('fs/promises');
const path = require('path');

const sourcePath = path.resolve(__dirname, 'files-copy');
const destinationPath = path.resolve(__dirname, 'files');

async function copyFolder() {
  try {
    await fs.rm(sourcePath, {
      recursive: true,
      force: true,
    });

    await fs.mkdir(sourcePath, {
      recursive: true,
    });

    const entries = await fs.readdir(destinationPath, {
      withFileTypes: true,
    });

    for (let entry of entries) {
      const srcPath = path.resolve(destinationPath, entry.name);
      const destPath = path.resolve(sourcePath, entry.name);

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

copyFolder();