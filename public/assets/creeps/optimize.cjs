
const fs = require('fs');
const { exec, execSync } = require('child_process');
let dir = fs.readdirSync('.');
// dir.forEach((item) => {
//     const itemPath = `./${item}`;
//     if (fs.lstatSync(itemPath).isDirectory()) {
//         let subDir = fs.readdirSync(itemPath);
//         subDir.forEach(async (subItem) => {
//             const subItemPath = `${itemPath}/${subItem}`;
//             if (fs.lstatSync(subItemPath).isFile() && subItem.endsWith('.png')) {
//                 const outputFilePath = `${itemPath}/${subItem.replace('.png', 's.png')}`;
//                 await execSync(`convert -resize 128x128 -quality 80 ${subItemPath} ${outputFilePath}`);
//                 fs.unlinkSync(subItemPath);
//                 fs.renameSync(outputFilePath, subItemPath);
//             }
//         });
//     }
// });
// Disabled for now, dont need to optimize assets.
