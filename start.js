
var exec = require('child_process').exec;

var child = exec('yarn serve', function(err, stdout, stderr) {
    // if (err) throw err;
    console.log(stdout);
  });