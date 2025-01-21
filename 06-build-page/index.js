const fs = require('fs/promises');
const path = require('path');

function resolveRootPath(pathPart) {
  return path.resolve(__dirname, pathPart);
}

const destinationPath = resolveRootPath('project-dist');
fs.mkdir(destinationPath, { recursive: true });


// HTML Templates
const template = resolveRootPath('template.html');
const indexFile = path.join(destinationPath, 'index.html');
fs.copyFile(template, indexFile);

async function tagsInterpolation() {
  const componentsDir = resolveRootPath('components');
  const components = await fs.readdir(componentsDir);

  for (let component of components) {
    const indexContent = await fs.readFile(indexFile, 'utf-8');
    const componentName = path.basename(component, path.extname(component));
    const componentContent = await fs.readFile(path.join(componentsDir, component), 'utf-8');

    await fs.writeFile(
      indexFile,
      indexContent.replace(`{{${componentName}}}`, componentContent),
    );
  }
}

tagsInterpolation();

// Styles
const stylesPath = resolveRootPath('styles');
const stylesOutputFile = path.join(destinationPath, 'bundle.css');

async function styleBundler(from, to) {
  const entries = await fs.readdir(from, {
    withFileTypes: true,
  });

  const output = [];

  for (let entry of entries) {
    const extension = path.extname(entry.name);

    if (entry.isFile() && extension === '.css') {
      const srcPath = path.resolve(from, entry.name);
      const entryContent = await fs.readFile(srcPath, { encoding: 'utf-8' });
      output.push(entryContent);
    }
  }

  await fs.writeFile(to, output.join('\n'));
}

styleBundler(stylesPath, stylesOutputFile);


// Assets moving
const assetsDestinationPath = path.join(destinationPath, 'assets');
const assetsSourcePath = resolveRootPath('assets');

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

      await fs.copyFile(srcPath, destPath);
    }
  } catch (error) {
    console.error('Error copying folder:', error);
    throw error;
  }
}

copyFolder(assetsSourcePath, assetsDestinationPath);