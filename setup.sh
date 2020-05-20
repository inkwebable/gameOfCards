#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra')

const sourceDir = path.resolve(__dirname, 'dist/images/game-of-cards');
let destinationDir = `${process.env.INIT_CWD}\\images\\game-of-cards`;
const destinationAssetsDir = `${process.env.INIT_CWD}\\assets`;
const destinationPublicDir = `${process.env.INIT_CWD}\\public`;

console.log('destinationDir', destinationDir);
console.log('sourceDir', sourceDir);

if (fs.existsSync(destinationPublicDir)) {
  destinationDir = `${process.env.INIT_CWD}\\public\\images\\game-of-cards`;
} else if (fs.existsSync(destinationAssetsDir)) {
  destinationDir = `${process.env.INIT_CWD}\\assets\\images\\game-of-cards`;
} else {
  if (!fs.existsSync(destinationDir)){
    fs.mkdirSync(destinationDir, { recursive: true });
  }
}

fs.copySync(sourceDir, destinationDir);
console.log("\x1b[32m", `Game of Card default images copied to ${destinationDir}`);
