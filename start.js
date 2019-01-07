
var exec = require('child_process').exec;

var child = exec('npm run serve', function(err, stdout, stderr) {
    // if (err) throw err;
    console.log(stdout);
  });