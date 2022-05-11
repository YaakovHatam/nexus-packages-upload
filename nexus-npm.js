'use strict';

const fs = require('fs');
const dirs = require('./dirs');
const { promises: { readdir } } = require('fs')
const path = require('path');
const { exec } = require("child_process");
const request = require("request");
const currentComponents = require('./components.json');

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

const isPathExist = (baseDir, fileOrFolder) => fs.existsSync(path.join(baseDir, fileOrFolder))

const isRealPackage = dir => {
   if (isPathExist(dir, 'package.json')) {
      try {
         const fullPathName = path.join(dir, 'package.json');
         const componentFileContent = require(fullPathName);
         return !!componentFileContent.name;
      } catch (ex) {
         console.log(dir + 'package.json', ex)
         return false;
      }

   }
   return false;
}

const mapPackageDetails = dir => {
   console.log(dir);
   const fullPathName = path.join(dir, 'package.json');
   const componentFileContent = require(fullPathName);
   const componentName = componentFileContent.name;
   const componentNameWithoutBrand = componentFileContent.name.split('/')[1] || componentName;
   const componentVersion = componentFileContent.version;
   const componentDirectory = path.basename(path.dirname(fullPathName));

   return { dir, componentName, componentVersion, componentDirectory, componentNameWithoutBrand }
}

const isNotExistInNexus = componentDetails => {
   const isExist = currentComponents
      .find(repo => repo.name === componentDetails.componentName
         && repo.version === componentDetails.componentVersion);

   return typeof isExist !== 'undefined';

}

const getNexusComponents = async (continuationToken) => new Promise((resolve, reject) => {
   const nexusUrl = 'http://sh-repo01.sh.shaam.gov.il/service/rest/v1/components?repository=npm-internal';
   const headers = {
      "Authorization": 'Basic aG0yNDphZG1pbjEyMw==',
   };

   const req = request.get(nexusUrl, {
      headers: headers,
      qs: (continuationToken && { continuationToken: continuationToken })
   }, function (err, data) {
      const parsedData = JSON.parse(data.body);
      console.log('fetched ', parsedData.items.length, 'results with token ', continuationToken);
      resolve({
         items: parsedData.items,
         continuationToken: parsedData.continuationToken
      });
   });
});

const listAllNexusComponents = async (componentsList, continuationToken) => {
   if (continuationToken == null) return componentsList;

   console.log('Keep going, current: ', componentsList.length, 'components');

   return await getNexusComponents(continuationToken).then(res => {
      const { items, continuationToken } = res;
      componentsList.push(...items);
      return listAllNexusComponents(componentsList, continuationToken);
   });
}

const uploadToNexus = tarFilepath => new Promise((resolve, reject) => {
   const nexusUrl = 'http://sh-repo01.sh.shaam.gov.il/service/rest/v1/components?repository=npm-internal';
   const headers = {
      "Authorization": 'Basic aG0yNDphZG1pbjEyMw=='
   };

   const req = request.post(nexusUrl, {
      headers: headers
   }, err => {
      if (err) {
         console.warn(err);
         reject('Error!');
      } else {
         console.log(tarFilepath + ' success');
         resolve(tarFilepath + ' success');
      }
   });

   const form = req.form();
   form.append('npm.asset', fs.createReadStream(tarFilepath));
});

async function createTars(WORKING_DIR, tarsDir) {
   return dirs.getDirectoriesRecursive(WORKING_DIR)
      .then(dirs => dirs.filter(isRealPackage))
      .then(dirs => dirs.map(mapPackageDetails))
      //.then(components => components.filter(isNotExistInNexus))
      .then(components => Promise.all(components.map(c => createTar(tarsDir, `${c.componentNameWithoutBrand}-${c.componentVersion}.tar.gz`, c.dir, c.componentDirectory))))
}

async function uploadTars(tarsDir) {
   const tarFiles = fs.readdirSync(tarsDir).map(tf => path.join(tarsDir, tf));
   return Promise.all(tarFiles.map(tf => uploadToNexus(tf)));
}

const op = 3;

const BASE_DIR = 'C:\\Users\\hm24\\Downloads\\nexus-packages\\npm\\process\\node_modules06-04-2022';
const tarsDir = 'C:\\Users\\hm24\\Downloads\\nexus-packages\\npm\\tarznew';

switch (op) {
   case 2: {
      createTars(BASE_DIR, tarsDir).then(c => console.log(c));
   }
      break;
   case 3: {
      uploadTars(tarsDir).then(c => console.log(c));
   }
      break;
   case 4: {
      listAllNexusComponents([], '').then(componentList => {
         fs.writeFileSync('components.json', JSON.stringify(componentList));
      });
   }
}

