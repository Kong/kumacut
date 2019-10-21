#!/usr/bin/env node

const program = require("commander");
const chalk = require("chalk");

const namespace = "Kuma";
const scriptVer = "0.0.1";

const LatestSemver = require("latest-semver");
const releases = require("./docs/public/releases.json");
const latest = LatestSemver(releases);

program.version(scriptVer, "-v, --version", "Output the current version of this script.");

program
  .option("-l, --latest", `Display the latest version of ${namespace}.`)
  .option("-a, --all", `Display all versions of ${namespace}.`);

// get the latest version
if (program.latest) {
  console.log(`The latest version of ${namespace} is ${chalk.green.bold(latest)}`);
}

// display all versions
if (program.all) {
  console.log(releases);
}

program
  .command("cut")
  .option("--major, --minor", "The type of release.")
  .action(function(cmdObj) {
    let currentVer = latest.split(".");
    let major = parseInt(currentVer[0]);
    let minor = parseInt(currentVer[1]);
    let patch = parseInt(currentVer[2]);
    let newVer;
    let newType = "patch";

    if (cmdObj.major) {
      newVer = `${major + 1}.${minor}.${patch}`;
      newType = "major";
    } else if (cmdObj.minor) {
      newVer = `${major}.${minor + 1}.${patch}`;
      newType = "minor";
    } else {
      newVer = `${major}.${minor}.${patch + 1}`;
    }

    console.log(`New version: ${chalk.blue.bold(newType)}, ${chalk.green.bold(latest)} ➜ ${chalk.green.bold(newVer)}`);

    // return newVer;
  });

// parse our program's arguments
program.parse(process.argv);
