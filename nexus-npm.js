'use strict';

const fs = require('fs');
const path = require('path');
const { exec } = require("child_process");
const dirsAndFilesOps = require('./dirs-and-files-ops');
const shared = require('./shared');
const logger = require('./logger');

const createTar = (tarsDir, tarFilename, folder, dirName) => new Promise((res, rej) => {
   exec(`tar --exclude=node_modules -czf "${path.join(tarsDir, tarFilename)}" -C .. "${dirName}"`, {
      cwd: folder
   }, (error, stdout, stderr) => {
      if (error) {
         rej(`error: ${error.message}`);
         return;
      }
      if (stderr) {
         rej(`stderr: ${stderr}`);
         return;
      }
      res(`${tarFilename}`);
   });
});

const isRealPackage = dir => {
   if (dirsAndFilesOps.isPathExist(dir, 'package.json')) {
      try {
         const fullPathName = path.join(dir, 'package.json');
         const componentFileContent = require(fullPathName);
         return !!componentFileContent.name && !!componentFileContent.version;
      } catch (ex) {
         logger('Corrrupted pacakge?', dir, ex)
         return false;
      }
   }
   return false;
}

const mapPackageDetails = dir => {
   const fullPathName = path.join(dir, 'package.json');
   const componentFileContent = require(fullPathName);
   let componentName = componentFileContent.name;

   let componentBrand;

   if (componentFileContent.name.indexOf('@') === 0) {
      [componentName, componentBrand] = componentFileContent.name.split('/')[1];
   }



   const componentVersion = componentFileContent.version;

   const componentDirectory = path.basename(path.dirname(fullPathName));
   // TODO: Save under brand directory
   const fileName = `${componentName}-${componentVersion}.tar.gz`;

   return {
      dir, componentName,
      componentBrand, componentVersion,
      componentDirectory, fileName
   }

}

async function createTars(WORKING_DIR, tarsDir) {
   return dirsAndFilesOps.getDirectoriesRecursive(WORKING_DIR).then(dirs => dirs.filter(isRealPackage))
      .then(dirs => dirs.map(mapPackageDetails))
      .then(components => dirsAndFilesOps.resolveDirectoryContent(tarsDir, false)
         .then(existings => components.filter(c => existings.indexOf(c.fileName) === -1))).then(components => {
            logger('Total', components.length, 'tars');

            return Promise.all(components.map(c => createTar(tarsDir,
               c.fileName,
               c.dir,
               c.componentDirectory)))
         });
}

const upload = async (tarsDir, repository) => dirsAndFilesOps.resolveDirectoryContent(tarsDir, true)
   .then(tarFiles => Promise.all(tarFiles.map(tf => shared.uploadToNexus(repository, [{
      formKey: 'npm.asset',
      formValue: fs.createReadStream(tf),
      filepath: tf
   }]))));

const performBulkUpload = (basePath, nexusRepository, args) => createTars(basePath, args.tarsDir)
   .then(() => upload(args.tarsDir, nexusRepository));

module.exports = performBulkUpload;
