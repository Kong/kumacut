#!/usr/bin/env node

// required tools
const fs = require("fs-extra");
const path = require("path");
const program = require("commander");
const chalk = require("chalk");
const LatestSemver = require("latest-semver");

// script meta
const namespace = "Kuma";
const scriptVer = "0.0.1";

// app version info
const releases = require("./docs/public/releases.json");
const latest = LatestSemver(releases);
const sourcVersionDir = path.resolve(__dirname, "./draft");

program.version(scriptVer, "-v, --version", "Output the current version of this script.");

/**
 * copyDir
 *
 * Copy the base version directory to a new one
 */
copyDir = (source, dest) => {
  fs.copy(source, dest, err => {
    if (err) {
      console.log(chalk.red.bold(err));
    } else {
      console.log(`${chalk.green.bold("✔")} New version folder created!`);
    }
  });
};

/**
 * updateReleaseList
 *
 * Updates the release list JSON file to include the new version
 */
updateReleaseList = (list, ver) => {};

/**
 * bumpVersion
 *
 * Bump the version based on the release type or a custom value.
 */
bumpVersion = (type, val) => {
  let currentVer = latest.split(".");
  let major = parseInt(currentVer[0]);
  let minor = parseInt(currentVer[1]);
  let patch = parseInt(currentVer[2]);
  let label, ver;

  switch (type) {
    case "major":
      ver = `${major + 1}.${minor}.${patch}`;
      label = "major";
      break;
    case "minor":
      ver = `${major}.${minor + 1}.${patch}`;
      label = "minor";
      break;
    case "patch":
      ver = `${major}.${minor}.${patch + 1}`;
      label = "patch";
      break;
    case "custom":
      ver = val.replace("v", "");
      label = "custom";
      break;
  }

  console.log(
    `${chalk.green.bold("✔")} New Release: ${chalk.blue.bold(label)}, ${chalk.green.bold(latest)} ➜ ${chalk.green.bold(
      ver
    )}`
  );

  // create the new version folder accordingly
  copyDir(sourcVersionDir, `./${ver}`);
};

program
  .option("--major", "Cut a major release.")
  .option("--minor", "Cut a minor release.")
  .option("--patch", "Cut a patch release.")
  .option("--custom <ver>", "Cut a release with a user-defined version.")
  .option("-l, --latest", `Display the latest version of ${namespace}.`)
  .option("-a, --all", `Display all versions of ${namespace}.`)
  .parse(process.argv);

// get the latest version
if (program.latest) {
  console.log(`The latest version of ${namespace} is ${chalk.green.bold(latest)}`);
}

// display all versions
if (program.all) {
  console.log(releases);
}

// major
if (program.major) {
  bumpVersion("major");
}

// minor
if (program.minor) {
  bumpVersion("minor");
}

// patch
if (program.patch) {
  bumpVersion("patch");
}

// custom (user-defined version)
if (program.custom !== undefined) {
  bumpVersion("custom", program.custom);
}
