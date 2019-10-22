#!/usr/bin/env node

const { lstatSync, readdirSync } = require("fs");
const { join } = require("path");
const program = require("commander");
const chalk = require("chalk");
const LatestSemver = require("latest-semver");

const namespace = "Kuma";
const scriptVer = "0.0.1";

const CURR_DIR = process.cwd();
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

/**
 *
 */
isDirectory = source => {
  lstatSync(source).isDirectory();
};

getDirectories = source => {
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory);
};

/**
 * bumpVersion
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

  // return ver;
};

program
  .option("--major", "Cut a major release.")
  .option("--minor", "Cut a minor release.")
  .option("--patch", "Cut a patch release.")
  .option("--custom <ver>", "Cut a release with a user-defined version.");

// parse our program's arguments
// NOTE: this has to come before the flag handling below
program.parse(process.argv);

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
if (program.custom) {
  bumpVersion("custom", program.custom);
}
