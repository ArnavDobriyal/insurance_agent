#!/usr/bin/env node

const requiredVersion = 20;
const currentVersion = process.versions.node.split('.')[0];

console.log(`\n🔍 Checking Node.js version...\n`);
console.log(`Current version: v${process.versions.node}`);
console.log(`Required version: v${requiredVersion}.0.0 or higher\n`);

if (parseInt(currentVersion) < requiredVersion) {
  console.error(`❌ ERROR: Node.js version ${requiredVersion}.0.0 or higher is required!`);
  console.error(`\nYour current version (v${process.versions.node}) is too old.\n`);
  console.error(`Please upgrade Node.js:`);
  console.error(`  • Using nvm: nvm install 20 && nvm use 20`);
  console.error(`  • Or download from: https://nodejs.org/\n`);
  process.exit(1);
}

console.log(`✅ Node.js version is compatible!\n`);
process.exit(0);
