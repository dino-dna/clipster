#!/bin/bash

set -x
ls -al

sudo chmod -R ugo+rwx .

yarn
yarn lint
yarn prerelease

function electron_build () {
  if [ "$TRAVIS_OS_NAME" == "linux" ]; then
    docker run --rm \
      --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS|APPVEYOR_|CSC_|_TOKEN|_KEY|AWS_|STRIP|BUILD_') \
      -v ${PWD}:/project \
      -v ~/.cache/electron:/root/.cache/electron \
      -v ~/.cache/electron-builder:/root/.cache/electron-builder \
      electronuserland/builder:wine \
      /bin/bash -c "yarn --link-duplicates --pure-lockfile && ./node_modules/.bin/electron-builder --linux --win $1"
  else
    ./node_modules/.bin/electron-builder $1
  fi
}

if [[ $TRAVIS_BRANCH == "master" ]]
then
  electron_build "--publish always"
  yarn semantic-release || true
else
  electron_build ""
fi

# wait for all artifacts up in release
# close draft

# hush hush, travis
set +x
