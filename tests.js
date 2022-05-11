const dirsAndFilesOps = require('./dirs-and-files-ops');
const globals = require('./globals');
const path = require('path');

const arr = [
   'C:\\temp\\asdad',
   'C:\\temp\\asdasd.nugpk',
   'C:\\temp\\asdasd2.nugpk',
   'C:\\temp\\asdasdsad',
   'C:\\temp\\New Text Document - Copy (2).txt',
   'C:\\temp\\New Text Document - Copy (3).txt',
   'C:\\temp\\New Text Document - Copy (4).txt',
   'C:\\temp\\New Text Document - Copy (5).txt',
   'C:\\temp\\New Text Document - Copy.txt',
   'C:\\temp\\New Text Document.txt',
   'C:\\temp\\asdad\\adasdad',
   'C:\\temp\\asdad\\asdasdasdasd',
   'C:\\temp\\asdasdsad\\asdasd2.nugpk',
   'C:\\temp\\asdad\\adasdad\\r534tg3gv5',
   'C:\\temp\\asdad\\asdasdasdasd\\asdasd23refcw2fd342',
   'C:\\temp\\asdad\\adasdad\\r534tg3gv5\\asdasd2.nugpk',
   'C:\\temp\\asdad\\asdasdasdasd\\asdasd23refcw2fd342\\vvvvvvv',
   'C:\\temp\\asdad\\asdasdasdasd\\asdasd23refcw2fd342\\vvvvvvv\\asdasd2.nugpk'
]

const filterRelevant = filePath => {
   console.log(2, dirsAndFilesOps.getFileExtension(filePath), 3, globals.fileExtensions.nuget,
      dirsAndFilesOps.getFileExtension(filePath) == globals.fileExtensions.nuget)

   return dirsAndFilesOps.getFileExtension(filePath).toLowerCase() == globals.fileExtensions.nuget.toLowerCase()
}


console.log(arr.filter(filterRelevant))
