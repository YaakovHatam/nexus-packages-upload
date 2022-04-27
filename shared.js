'use strict';

const request = require("request");
const globals = require('./globals');

const uploadToNexus = (repository, files) => new Promise((resolve, reject) => {
   const nexusUrl = `${globals.nexusUrl}service/rest/v1/components?repository=${repository}`;
   const headers = {
      "Authorization": `Basic ${globals.base64nexusUserPass}`
   };
   console.log(nexusUrl);

   const req = request.post(nexusUrl, {
      headers: headers
   }, (err, res, body) => {
      if (err) {
         console.warn(err);
         reject('Error!');
      } else if (res.statusCode !== 200) {
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