'use strict'

var cp = require('child_process')
var path = require('path')
var fs = require('fs')

var childOpts = {
  cwd: path.resolve(__dirname, '..'),
  env: Object.assign({}, process.env, { NODE_ENV: 'production' })
}

/**
 * Run semantic release through a subshell so we determine if it published a new
 * version or not.  Write a file used downstream in our build pipeline that has
 * the version, s.t. our electron-build can import that version into its
 * package JSON.
 * @returns {Promise<null>}
 */
async function semanticRelease () {
  console.log(`[clipster:semantic-release]: capturing default semantic-release to parse published version`)
  var stdout = cp.execSync('./node_modules/.bin/semantic-release --dry-run', childOpts).toString()
  process.stdout.write(stdout)
  var version = ''
  // locate the release version
  // ex:
  //  [Semantic release]: The next release version is 0.0.3
  try {
    console.log(`[clipster:semantic-release]: searching for published version`)
    version = stdout.match(/The next release version is\s*([^\s]*)\s*/)[1]
    console.log(`[clipster:semantic-release]: found version ${version}`)
  } catch (err) {
    console.log(`[clipster:semantic-release]: version not found`)
  }
  var versionFilename = path.resolve(__dirname, '..', 'PUBLISHED_VERSION')
  console.log(`[clipster:semantic-release]: writing published version file to ${versionFilename}`)
  fs.writeFileSync(versionFilename, version)
}
semanticRelease()
