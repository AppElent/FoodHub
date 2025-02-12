import * as fs from 'fs';
import psp from 'prompt-sync-plus';
import versions from './src/versions.json' with { type: 'json' };
const prompt = psp();

const pkgPath = './package.json';

// Read and parse package.json
const pkgData = fs.readFileSync(pkgPath, 'utf-8');
const pkg = JSON.parse(pkgData);
const oldVersion = pkg.version;

// Show the current version
console.log(`Current version: ${pkg.version}`);

// Prompt for new version
const newVersion = prompt('What version would you like to deploy? ');
const description = prompt('What is the description for this version? ');
//console.log(`Hello, ${name}!`);

pkg.version = newVersion;

// Write the updated package.json back to disk
if (newVersion && newVersion !== oldVersion) {
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
  fs.writeFileSync(
    './src/versions.json',
    JSON.stringify([...versions, { version: newVersion, description }], null, 2) + '\n',
    'utf-8'
  );
  console.log(`Updated version to ${newVersion} in package.json`);
}

// Ask the user for a new version
// rl.question('Enter new version: ', (newVersion) => {
//   // Update the package.json object with the new version
//   pkg.version = newVersion;

//   // Write the updated package.json back to disk
//   fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
//   console.log(`Updated version to ${newVersion} in package.json`);

//   // Close the readline interface
//   rl.close();

//   // Run the deploy script (make sure you have a "deploy" script defined in package.json)
//   exec('npm run deploy', (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error running deploy: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       console.error(`stderr: ${stderr}`);
//     }
//     console.log(`stdout: ${stdout}`);
//   });
// });
