# Kumacut 🐻✂

A script for handling the cutting of a release on the [Kuma](https://kuma.io/) website.

## Running the script locally

As to not interfere with the version that is run from the website repository, you can run it locally via `$ ./kumacut.js [command]`. When it's live on the website project, you'll be able to use `npm link` and run it globally: `$ kumacut [command]`.

## What the script does

1. It will clone the `draft` directory to a new directory that is named by the version specified
2. After cloning the directory, it will find and replace all instances of `%%VER%%` in the markdown files with the new version
3. It will add the new sidebar navigation structure for the new version to the `sidebar-nav.js` file (it bases the nav structure on the previous versions, so it may require manual editing on your part if there are new pages under your new release)
4. It will append the new version to the `releases.json` file, which is what the website uses to handle the versioning on the documentation pages, install, etc.

After these steps run, you can run the site locally with `yarn docs:dev` and you should see your new version running accordingly!

## How do I use the script?

You'll want to re-run `npm|yarn install` first and foremost. Once that's done, run `npm link`. This will link the `kumacut` command to your bin so you can run it globally.

### Here's the command breakdown

```
kumacut --help
Usage: kumacut [options] [command]

Options:
  -v, --version     Output the current version of this script.
  -h, --help        output usage information

Commands:
  latest            display the latest version of Kuma
  bump              this will simply cut a new patch and bump the patch number up by 1
  new <type> [ver]  options: major, minor, custom <version>, or it defaults to patch
```

If you want to simply put out a new patch and increment by 1, you can run `kumacut bump`. For anything else, you can run `kumacut new [major|minor|custom]`. For `custom`, you can supply a version number in case you don't want to use the default options.

If you want to simply see what the latest version in the docs is for reference, you can run `kumacut latest`.

---

### Developer notes

1. `targets` contains the files we modify with this script. This folder is for testing. In the website project, the paths for these files must be modified accordingly at the top of the script. We use `path.resolve` to figure out their location.
2. `draft` is a clone of a version directory from the website. It's used as the base from which our clone functionality copies from. It's special here because instead of containing a version number hard-coded into the markdown files, it contains the token `%%VER%%`. This is what the script looks for when doing a find-and-replace.
