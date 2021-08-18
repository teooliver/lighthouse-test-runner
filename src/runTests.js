#!/usr/bin/env node

const execSync = require('child_process').execSync;
const createReportsDir = require('./utils/createReportsDir');
const removeReportsDir = require('./utils/removeReportsDir');
const config = require('./config');
let runs = 0;

// directory path
const dir = config.reportsFolder;

//First remove previous tests then run script
removeReportsDir(dir);
createReportsDir(dir);

//Run lighthouse tests
do {
  console.log(`Running performance test ${runs + 1}`);

  try {
    execSync(
      `lighthouse ${
        config.websites.controlURL
      } --quiet --chrome-flags="--headless" --only-categories="performance" --output=json --output=html --output-path=./${dir}/${
        config.outFileName
      }-control-v${runs + 1}`
    );
    execSync(
      `lighthouse ${
        config.websites.testURL
      } --quiet --chrome-flags="--headless" --only-categories="performance" --output=json --output=html --output-path=./${dir}/${
        config.outFileName
      }-test-v${runs + 1}`
    );
  } catch (err) {
    console.log(`Performance test ${runs + 1} failed`);
    console.log(err);
    break;
  }

  console.log(`Finished running performance test ${runs + 1}`);
  runs++;
} while (runs < config.runLimit);
console.log(`All finished`);
