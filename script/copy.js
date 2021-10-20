const path = require('path');
const fs = require('fs-extra');
const globby = require('globby');
const output = path.resolve('dist');
const fList = [
    'src/collection.json',
    'src/react-app/schema.json',
    'src/react-app/files'
]

for(let f of fList){
    const inputPath = path.resolve(f);
    const outputPath = path.join(output,f.replace('src',''));
    fs.copySync(inputPath,outputPath);
}