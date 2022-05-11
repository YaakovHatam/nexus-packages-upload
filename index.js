require('dotenv').config()
const nugetUpload = require('./nexus-nuget');
const npmUpload = require('./nexus-npm');

const basePath = 'C:\\temp\\';
const nexusRepository = 'repository-name';

const tarsDir = 'C:\\tarz\\';

npmUpload(basePath, nexusRepository, {
   tarsDir: tarsDir
}).then(res => console.log(res));

// nugetUpload(basePath, nexusRepository).then(res => console.log(res));