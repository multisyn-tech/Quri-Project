import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, '../client/src'); // Update the path to your source directory

function renameFiles(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }

    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);

      fs.stat(fullPath, (err, stats) => {
        if (err) {
          console.log(`Error stating file ${fullPath}:`, err);
          return;
        }

        if (stats.isDirectory()) {
          renameFiles(fullPath); // Recursively rename files in subdirectories
        } else if (path.extname(fullPath) === '.js') {
          const newFullPath = fullPath.replace('.js', '.jsx');
          fs.rename(fullPath, newFullPath, (err) => {
            if (err) {
              console.log(`Error renaming file ${fullPath} to ${newFullPath}:`, err);
            } else {
              console.log(`Renamed: ${fullPath} -> ${newFullPath}`);
            }
          });
        }
      });
    });
  });
}

renameFiles(directoryPath);
