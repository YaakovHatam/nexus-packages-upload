const globals = require('./globals');

export default log = (...args) => globals.debug_mode && console.log(args);