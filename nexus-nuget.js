'use strict';

const fs = require('fs');
const request = require("request");
const globals = require('./globals');
const dirsAndFilesOps = require('./dirs-and-files-ops');

const uploadToNexus = (nupkgFilePath, repository) => new Promise((resolve, reject) => {
   const nexusUrl = `${globals.nexusUrl}/service/rest/v1/components?repository=${repository}`;
   const headers = {
      "Authorization": `Basic ${globals.base64nexusUserPass}`
   };

   const req = request.post(nexusUrl, {
      headers: headers
   }, err => {
      if (err) {
         console.warn(err);
         reject('Error!');
      } else {
         console.log(nupkgFilePath + ' success');
         resolve(nupkgFilePath + ' success');
      }
   });

   const form = req.form();
   form.append('nuget.asset', fs.createReadStream(nupkgFilePath));
});

const filterRelevant = filePath => dirsAndFilesOps.getFileExtension(filePath).toLowerCase() == globals.fileExtensions.nuget.toLowerCase();

const performBulkUpload = (basePath, nexusRepository) => {
   const BASE_DIR = dirsAndFilesOps.normalizePath(basePath);
   return dirsAndFilesOps.getDirectoriesRecursive(BASE_DIR)
      .then(dirs => Promise.all(dirs.map(dir => dirsAndFilesOps.resolveDirectoryContent(dir))))
      .then(dirs => dirsAndFilesOps.flatten(dirs))
      .then(dirs => dirs.filter(filterRelevant))
      .then(filteredFiles => Promise.all(filteredFiles.map(nugetFile => uploadToNexus(nugetFile, nexusRepository))));
}

module.exports = performBulkUpload;