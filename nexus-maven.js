'use strict';

const fs = require('fs');
const { promises: { readdir } } = require('fs')
const path = require('path');
const request = require("request");
const globals = require('./globals');

async function getFiles(dir) {
   const dirents = await readdir(dir, { withFileTypes: true });
   const files = await Promise.all(dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
   }));
   return Array.prototype.concat(...files);
}

/**
 * 
 * @param {string[]} filesPath 
 * @returns 
 */
const uploadToNexus = filesPath => new Promise((resolve, reject) => {
   const nexusUrl = 'http://sh-repo01.sh.shaam.gov.il/service/rest/v1/components?repository=maven-hosted';
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
         console.log(filesPath + ' success');
         resolve(filesPath + ' success');
      }
   });

   const form = req.form();
   form.append('maven2.generate-pom', 'false');

   filesPath.forEach((filePath, i) => {
      form.append(`maven2.asset${i + 1}`, fs.createReadStream(filePath));
      form.append(`maven2.asset${i + 1}.extension`, path.extname(filePath).substring(1));
   });
});

export default upload = (basePath, nexusRepository) => {
   const BASE_DIR = normalizePath(basePath);

   const WORKING_DIR = path.join(BASE_DIR, '');
   getFiles(WORKING_DIR)
      .then(c => c.filter(file => file.endsWith('.jar') || file.endsWith('.pom'))).then(uploadToNexus)
      .then(c => console.log(c));

}
