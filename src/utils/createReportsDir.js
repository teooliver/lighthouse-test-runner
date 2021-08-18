const fs = require('fs');

module.exports = function createReportsDir(dir) {
  try {
    // first check if directory already exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log('Directory is created.');
    } else {
      console.log('Directory already exists.');
    }
  } catch (err) {
    console.log(err);
  }
};
