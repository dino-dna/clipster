npm install --verbose
npm run lint

if [[ $TRAVIS_BRANCH == "master" ]]
then
  npm run build:mac-linux
  npm run publish
  npm run semantic-release || true
else
  npx semantic-release --dry-run
  npm run build:mac-linux
fi
