
const fs = require('fs');
const path = require('path');

const unique = arr => [...new Set(arr)];

const flatten = (lists) => lists.reduce((a, b) => a.concat(b), []);

const getDirectories = async source => readdir(source, {
   withFileTypes: true
}).then(dirs => dirs.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name));

const getDirectoriesFullPath = srcpath => fs.readdirSync(srcpath)
   .map(file => path.join(srcpath, file))
   .filter(path => fs.statSync(path).isDirectory());

function _getDirectoriesRecursive(dirsList, visitedDirs, dirsToVisit) {
   if (dirsToVisit.length == 0) return dirsList;

   dirsToVisit.forEach(d => {
      const foundDirs = getDirectoriesFullPath(d);
      dirsList = dirsList.concat(foundDirs);
      dirsToVisit = dirsToVisit.concat(foundDirs);
      visitedDirs.push(d);
   });


   return _getDirectoriesRecursive(dirsList, visitedDirs, dirsList.filter(n => !visitedDirs.includes(n)));
}

async function getDirectoriesRecursive(srcpath) {
   let dirsList = [srcpath];
   return _getDirectoriesRecursive(dirsList, [], [srcpath]);
}

async function resolveDirectoryContent(baseFir, fullPath = true) {
   if (fullPath) {
      return fs.readdirSync(baseFir).map(tf => path.join(baseFir, tf));
   }
   else return fs.readdirSync(baseFir);
}

function normalizePath(basePath) {
   return path.normalize(basePath);
}

function getFileExtension(fileFullPathOrFile) {
   return path.extname(fileFullPathOrFile)
}

const isPathExist = (baseDir, fileOrFolder) => fs.existsSync(path.join(baseDir, fileOrFolder))

module.exports = {
   getDirectoriesRecursive,
   resolveDirectoryContent,
   normalizePath,
   getFileExtension,
   flatten,
   isPathExist
}
