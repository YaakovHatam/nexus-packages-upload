'use strict';

const fs = require('fs');
const globals = require('./globals');
const dirsAndFilesOps = require('./dirs-and-files-ops');
const shared = require('./shared');


const upload = (filepath, repository) => {
   const files = [{
      formKey: 'nuget.asset',
      formValue: fs.createReadStream(filepath),
      filepath: filepath
   }];

   return shared.uploadToNexus(repository, files);
}

const filterRelevant = filePath => dirsAndFilesOps.getFileExtension(filePath).toLowerCase() == globals.fileExtensions.nuget.toLowerCase();

const performBulkUpload = (basePath, nexusRepository) => {
   const BASE_DIR = dirsAndFilesOps.normalizePath(basePath);
   return dirsAndFilesOps.getDirectoriesRecursive(BASE_DIR)
      .then(dirs => Promise.all(dirs.map(dir => dirsAndFilesOps.resolveDirectoryContent(dir))))
      .then(dirs => dirsAndFilesOps.flatten(dirs))
      .then(dirs => dirs.filter(filterRelevant))
      .then(filteredFiles => Promise.all(filteredFiles.map(nugetFile => upload(nugetFile, nexusRepository))));
}

module.exports = performBulkUpload;