'use strict';


const fs = require('fs');
const dirs = require('./dirs');
const path = require('path');
const shared = require("./shared");

const upload = (filepath, repository) => {
   const files = [{
      formKey: 'pypi.asset',
      formValue: fs.createReadStream(filepath),
      filepath: filepath
   }]
   return shared.uploadToNexus(repository, files);
}

async function uploadWheels(tarsDir) {
   const wheelFiles = fs.readdirSync(tarsDir).map(tf => path.join(tarsDir, tf));
   return Promise.all(wheelFiles.map(tf => uploadToNexus(tf)));
}

const op = 1;

const BASE_DIR = 'C:\\Users\\hm24\\Downloads\\nexus-packages\\pip\\to-upload\\';

switch (op) {
   case 1: {
      uploadWheels(BASE_DIR).then(c => console.log(c));
   }
}

