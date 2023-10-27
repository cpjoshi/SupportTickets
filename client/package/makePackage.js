var dotenv = require ('dotenv').config({path: __dirname + '/.env'});
var fs = require('fs');
var AdmZip = require("adm-zip");
var zip = new AdmZip();

let dir = __dirname + '/manifest.template.json';
fs.readFile(dir, 'utf8', function (err, data) {
    if (err != null) {
        console.log(err);
        return;
    }

    Object.keys(process.env).forEach((key) => {
        if (key.indexOf('TEAMS_APP_ID') === 0 ||
            key.indexOf('HOST_NAME') === 0 ||
            key.indexOf('CLIENT_ID') === 0) {
            data = data.split(`<${key}>`).join(process.env[key]);
            console.log (`Inserted ${key} value of ${process.env[key]}`);
        }
    });
    
    fs.writeFile('teams-package/manifest.json', data, 'utf-8', (err, data) => {
        if (err) throw err;

        zip.addLocalFile(`teams-package/manifest.json`);
        zip.addLocalFile(`teams-package/icon32.png`);
        zip.addLocalFile(`teams-package/icon240.png`);

        zip.writeZip(`teams-package/rightshift-teamsapp.zip`);
        console.log(`Created app package teams-package//rightshift-teamsappp.zip`);
    });
});