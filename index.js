require('dotenv').config()
const nugetUpload = require('./nexus-nuget');

const basePath = 'C:\\some\\directory\\contains\\nugpk\\files\\';
const nexusRepository = 'repository-name';

nugetUpload(basePath, nexusRepository).then(res => console.log(res));