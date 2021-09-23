const fs = require('fs');

const ErrorLog = (source, error) => {
    var now = new Date().toString();
    var log = (`${now}\n${source}\n${error}`);
    fs.appendFile('./src/utility/error.log', log + '\n', (err) => {
        if(err) console.log('Unable to append to error.log.', err)
    });
}
module.exports = ErrorLog;