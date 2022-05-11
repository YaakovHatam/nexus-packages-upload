const fs = require('fs');
const { promises: { readdir } } = require('fs')
const path = require('path');
const { exec } = require("child_process");
const request = require("request");



// curl -v --user 'admin:admin123' --upload-file ./test.rpm http://localhost:8081/repository/yum-hosted/test.rpm


const uploadToNexus = (filename, filePath) => new Promise((resolve, reject) => {
    const nexusUrl = 'http://sh-repo01.sh.shaam.gov.il/repository/yum-internal/' + filename;
    const headers = {
        "Authorization": 'Basic aG0yNDphZG1pbjEyMw=='
    };

    const req = request.post(nexusUrl, {
        headers: headers
    }, err => {
        if (err) {
            console.warn(err);
            reject('Error!');
        } else {
            console.log(filePath + ' success');
            resolve(filePath + ' success');
        }
    });

    const form = req.form();
    form.append('npm.asset', fs.createReadStream(tarFilepath));
});

const BASE_DIR = 'C:\\Users\\hm24\\Downloads\\nexus-packages\\yum';
const file = 'filebeat-8.1.0-aarch64.rpm';
path.join(BASE_DIR, file)

readdir(BASE_DIR)
    .then(tarFiles => Promise.all(
        tarFiles
            .filter(f => f.indexOf('azcmagent') > -1)
            .map(file => uploadToNexus(file, `${BASE_DIR}\\${file}`).then(c => console.log(c)))
    )
    ).then(c => console.log(c));