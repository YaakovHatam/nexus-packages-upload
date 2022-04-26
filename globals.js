const base64nexusUserPass = Buffer.from(process.env.NEXUS_USERNAME + ':' + process.env.NEXUS_PASSWORD).toString('base64');
const nexusUrl = process.env.NEXUS_URL;
const debug_mode = false;

const fileExtensions = {
   'nuget': '.nupkg'
}
module.exports = {
   base64nexusUserPass,
   nexusUrl,
   debug_mode,
   fileExtensions
}