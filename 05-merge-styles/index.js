const fs = require('fs/promises');
const path = require('path');

const sourcePath = path.resolve(__dirname, 'styles');
const destinationPath = path.resolve(__dirname, 'project-dist', 'bundle.css');

async function styleBundler() {
  const entries = await fs.readdir(sourcePath, {
    withFileTypes: true,
  });

  const output = [];

  for (let entry of entries) {
    const extension = path.extname(entry.name);

    if (entry.isFile() && extension === '.css') {
      const srcPath = path.resolve(sourcePath, entry.name);
      const entryContent = await fs.readFile(srcPath, { encoding: 'utf-8' });
      output.push(entryContent);
    }
  }

  await fs.writeFile(destinationPath, output.join('\n'));
}

styleBundler();