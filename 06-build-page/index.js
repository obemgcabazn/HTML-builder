const fs = require('fs/promises');
const path = require('path');

function resolveRootPath(pathPart) {
  return path.resolve(__dirname, pathPart);
}

async function main() {
  try {
    const destinationPath = resolveRootPath('project-dist');
    await fs.mkdir(destinationPath, { recursive: true });

    // HTML Templates
    const template = resolveRootPath('template.html');
    const indexFile = path.join(destinationPath, 'index.html');
    await fs.copyFile(template, indexFile);

    // Wait for HTML processing to complete before proceeding
    await tagsInterpolation();

    // Process styles and assets in parallel
    await Promise.all([
      styleBundler(resolveRootPath('styles'), path.join(destinationPath, 'style.css')),
      copyFolder(resolveRootPath('assets'), path.join(destinationPath, 'assets'))
    ]);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

async function tagsInterpolation() {
  const componentsDir = resolveRootPath('components');
  const indexFile = path.join(resolveRootPath('project-dist'), 'index.html');

  const components = await fs.readdir(componentsDir);
  let indexContent = await fs.readFile(indexFile, 'utf-8');

  for (const component of components) {
    const componentName = path.basename(component, path.extname(component));
    const componentContent = await fs.readFile(
        path.join(componentsDir, component),
        'utf-8'
    );

    indexContent = indexContent.replace(`{{${componentName}}}`, componentContent);
  }

  await fs.writeFile(indexFile, indexContent);
}

async function styleBundler(from, to) {
  const entries = await fs.readdir(from, {
    withFileTypes: true,
  });

  const output = [];

  for (const entry of entries) {
    const extension = path.extname(entry.name);

    if (entry.isFile() && extension === '.css') {
      const srcPath = path.resolve(from, entry.name);
      const entryContent = await fs.readFile(srcPath, { encoding: 'utf-8' });
      output.push(entryContent);
    }
  }

  await fs.writeFile(to, output.join('\n'));
}

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

    await Promise.all(
        entries.map(async (entry) => {
          const srcPath = path.resolve(from, entry.name);
          const destPath = path.resolve(to, entry.name);

          if (entry.isFile()) {
            await fs.copyFile(srcPath, destPath);
          } else if (entry.isDirectory()) {
            await copyFolder(srcPath, destPath);
          }
        })
    );
  } catch (error) {
    console.error('Error copying folder:', error);
    throw error;
  }
}

// Execute the main function
main().catch(console.error);