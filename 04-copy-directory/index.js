const fs = require('fs/promises');
const path = require('path');

const destinationPath = path.resolve(__dirname, 'files-copy');
const sourcePath = path.resolve(__dirname, 'files');

async function copyFolder() {
  try {
    await fs.rm(destinationPath, {
      recursive: true,
      force: true,
    });

    await fs.mkdir(destinationPath, {
      recursive: true,
    });

    const entries = await fs.readdir(sourcePath, {
      withFileTypes: true,
    });

    for (let entry of entries) {
      const srcPath = path.resolve(sourcePath, entry.name);
      const destPath = path.resolve(destinationPath, entry.name);

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