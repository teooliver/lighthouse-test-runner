const fs = require('fs');

// delete directory recursively
module.exports = function removeReportsDir(dir) {
  try {
    fs.rmdirSync(dir, { recursive: true });
  } catch (err) {
    console.error(`Error while deleting ${dir}.`);
  }
};
