#!/usr/bin/env node

// required tools
const fs = require("fs-extra");
const path = require("path");
const replace = require("replace-in-file");
const program = require("commander");
const chalk = require("chalk");
const LatestSemver = require("latest-semver");

// script meta
const namespace = "Kuma";
const scriptVer = "0.0.1";

// app version info
const releases = "./targets/releases.json"; // update path when moved to website
const sidebarNav = "./targets/sidebar-nav.js"; // update path when moved to website
const latest = LatestSemver(require(releases));
const sourcVersionDir = path.resolve(__dirname, "./draft");

// this is the token we replace in the documentation
// markdown files when cutting a new release
const verToken = "%%VER%%";

/**
 * @function replaceVerToken
 *
 * @description This will search for the version token in our source docs folder
 * and replace it with the version number specified by our release type
 */
replaceVerToken = (token, ver) => {
  const options = {
    files: `${ver}/**/*.md`,
    from: new RegExp(token, "g"),
    to: ver
  };

  try {
    const results = replace.sync(options);
    console.log(`${chalk.green.bold("✔")} Version number updated to ${chalk.blue.bold(ver)} in all Markdown files!`);
  } catch (err) {
    console.log(chalk.red.bold(err));
  }
};

/**
 * @function copyDir
 *
 * @description Copy the base version directory to a new one
 */
copyDir = (source, dest) => {
  fs.copy(source, dest)
    .then(() => {
      // let the user know that their folder has been created
      console.log(`${chalk.green.bold("✔")} New version folder created!`);
    })
    .then(() => {
      // replace the version token in the documentation markdown files accordingly
      replaceVerToken(verToken, dest.replace("./", ""));
    })
    .catch(err => {
      console.log(chalk.red.bold(err));
    });
};

/**
 * @function updateReleaseList
 *
 * @description Updates the release list JSON file to include the new version
 */
updateReleaseList = (list, ver) => {
  const listSrc = require(list);
  let versions = listSrc;

  // update the release object
  versions.push(ver);

  // write the new object to the release list
  fs.writeFileSync(list, JSON.stringify(versions, null, 2), err => {
    if (err) {
      console.log(chalk.red.bold(err));
    }

    console.log(`${chalk.green.bold("✔")} ${chalk.blue.bold(ver)} added to release list file!`);
  });
};

/**
 * @function bumpVersion
 *
 * @description Bump the version based on the release type or a custom value.
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

  // update the release list
  updateReleaseList(releases, ver);
};

// all of our program's option and functionality couplings
program
  .version(scriptVer, "-v, --version", "Output the current version of this script.")
  .option("--major", "Cut a major release.")
  .option("--minor", "Cut a minor release.")
  .option("--patch", "Cut a patch release.")
  .option("--custom <ver>", "Cut a release with a user-defined version.")
  .option("-l, --latest", `Display the latest version of ${namespace}.`)
  .option("-a, --all", `Display all versions of ${namespace}.`)
  .option("--sidebar", "Display the current sidebar arrangement.")
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

if (program.sidebar) {
  // make sure the sidebar nav file exists first
  fs.access(sidebarNav, fs.F_OK, err => {
    if (err) {
      console.log(chalk.red.bold(err));
      return false;
    }

    console.log(chalk.blue.bold("Current sidebar structure:"));
    console.table(require(sidebarNav));
  });
}
