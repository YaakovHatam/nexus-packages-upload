require('dotenv').config()
const nugetUpload = require('./nexus-nuget');

const basePath = 'C:\\temp\\';
const nexusRepository = 'repository-name';

nugetUpload(basePath, nexusRepository).then(res => console.log(res));