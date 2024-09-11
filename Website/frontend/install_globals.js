const fs = require('fs');
const { exec } = require('child_process');

function installPackage(packageName, version) {
  return new Promise((resolve, reject) => {
    exec(`npm install -g ${packageName}@${version}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error installing ${packageName}: ${error}`);
        return reject(error);
    }
      resolve(stdout);
    });
  });
}

fs.readFile('package.json', 'utf8', async (err, data) => {
  if (err) {
    return console.error('Error reading package.json:', err);
  }

  try {
    const packageJson = JSON.parse(data);
    const dependencies = {...packageJson.dependencies, ...packageJson.devDependencies};

    for (const [packageName, version] of Object.entries(dependencies)) {
      await installPackage(packageName, version);
    }
  } catch (parseErr) {
    console.error('Error parsing package.json:', parseErr);
  }
});
