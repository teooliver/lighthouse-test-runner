# lighthouse-utils

This program will run multiple lighthouse tests and compare between a control and test branches.

You will need `lighthouse` installed globaly.

`npm install -g lighthouse`

Make the `runTests.js` executable from the terminal:

`chmod a+x src/runTests.js`

Create a `config.js` inside the `src` folder following the `config.example.js` file.

Run the script: `src/runTests.js`

This will create a `reports` folder with the `html` and `json` lighthouse reports.
