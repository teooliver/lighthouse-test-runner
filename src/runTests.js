#!/usr/bin/env node

const execSync = require("child_process").execSync
const createReportsDir = require("./utils/createReportsDir")
const removeReportsDir = require("./utils/removeReportsDir")
const converter = require("json-2-csv")
const fs = require("fs")
const config = require("./config")
let runs = 0
const controlFilePaths = []
const testFilePaths = []

// directory path
const dir = config.reportsFolder

//First remove previous tests then run script
removeReportsDir(dir)
createReportsDir(dir)

const audits = {
  "first-contentful-paint": {
    label: "First Contentful Paint",
    unit: "s",
    formula: (x) => (x / 1000).toFixed(2),
    controlValue: 0,
    testValue: 0,
  },
  "largest-contentful-paint": {
    label: "Largest Contentful Paint",
    unit: "s",
    formula: (x) => (x / 1000).toFixed(2),
    controlValue: 0,
    testValue: 0,
  },
  "speed-index": {
    label: "Speed Index",
    unit: "s",
    formula: (x) => (x / 1000).toFixed(2),
    controlValue: 0,
    testValue: 0,
  },
  interactive: {
    label: "Time to Interactive",
    unit: "s",
    formula: (x) => (x / 1000).toFixed(2),
    controlValue: 0,
    testValue: 0,
  },
  "total-blocking-time": {
    label: "Total Blocking Time",
    unit: "ms",
    formula: (x) => Math.round(x),
    controlValue: 0,
    testValue: 0,
  },
  "cumulative-layout-shift": {
    label: "Cumulative Layout Shift",
    unit: "",
    formula: (x) => x.toFixed(3),
    controlValue: 0,
    testValue: 0,
  },
}

// Run lighthouse tests
do {
  console.log(`Running performance test ${runs + 1}`)

  const controlFilePath = `${dir}/${config.outFileName}-control-v${runs + 1}`
  const testFilePath = `${dir}/${config.outFileName}-test-v${runs + 1}`

  controlFilePaths.push(controlFilePath)
  testFilePaths.push(testFilePath)

  try {
    execSync(
      `lighthouse ${config.websites.controlURL} --quiet --chrome-flags="--headless" --only-categories="performance" --output=json --output=html --output-path=./${controlFilePath}`
    )
    execSync(
      `lighthouse ${config.websites.testURL} --quiet --chrome-flags="--headless" --only-categories="performance" --output=json --output=html --output-path=./${testFilePath}`
    )
  } catch (err) {
    console.log(`Performance test ${runs + 1} failed`)
    console.log(err)
    break
  }

  console.log(`Finished running performance test ${runs + 1}`)
  runs++
} while (runs < config.runLimit)

console.log(`Creating results csv`)

const getValues = (paths, value) => {
  paths.forEach((filePath) => {
    const results = JSON.parse(fs.readFileSync(`${filePath}.report.json`))

    Object.values(results.audits)
      .filter(({ id }) => Object.keys(audits).includes(id))
      .forEach(({ id, numericValue }) => (audits[id][value] += numericValue))
  })

  Object.keys(audits).forEach((key) => {
    const averageValue = audits[key][value] / config.runLimit
    audits[key][value] = `${audits[key].formula(averageValue)}${
      audits[key].unit
    }`
  })
}

getValues(controlFilePaths, "controlValue")
getValues(testFilePaths, "testValue")

const output = Object.values(audits).map(
  ({ label, controlValue, testValue }) => {
    return { label, controlValue, testValue }
  }
)

converter
  .json2csvAsync(output)
  .then((csv) => {
    fs.writeFileSync("results.csv", csv)
    console.log(`Results csv created`)
  })
  .catch((err) => console.log(err))

console.log(`All finished`)
