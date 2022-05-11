const globals = require('./globals');

const log = (...args) => globals.debug_mode && console.log(args);

module.exports = log;

