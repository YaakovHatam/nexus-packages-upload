'use strict';

const request = require("request");
const globals = require('./globals');
const logger = require('./logger');

const uploadToNexus = (repository, files) => new Promise((resolve, reject) => {
   const nexusUrl = `${globals.nexusUrl}service/rest/v1/components?reposi=tory=${repository}`;

   const headers = {
      "Authorization": `Basic ${globals.base64nexusUserPass}`
   };

   const req = request.post(nexusUrl, {
      headers: headers
   }, (err, res, body) => {
      if (err) {
         console.warn(err);
         reject('Error!');
      } else if (res.statusCode !== 204) {
         logger(res.statusCode, res.body)
         reject('Error: ' + res.statusCode + res.body);

      } else {
         resolve(files.map(f => f.filepath) + ' success');
      }
   });

   const form = req.form();
   files.forEach(file => form.append(file.formKey, file.formValue))
});

module.exports = {
   uploadToNexus
}
