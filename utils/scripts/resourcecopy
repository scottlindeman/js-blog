#!/bin/bash

BASE=$HOME"/workspace/web/js-blog/"
APPDIR=$BASE"target/app/"
TEMPDIR=$BASE"target/temp/"
SRCDIR=$BASE"src/"

echo 'Processing Resources...'

echo 'Minifying...'
./utils/scripts/jscompress.sh $SRCDIR"resources/app/js/" $TEMPDIR"js/" "app.js"
./utils/scripts/csscompress.sh $SRCDIR"resources/app/css/" $TEMPDIR"css/" "app.css"

echo 'Copying...'

rm -r $APPDIR
mkdir $APPDIR
mkdir $APPDIR"resources"
mkdir $APPDIR"resources/app"
mkdir $APPDIR"resources/app/js" $APPDIR"resources/app/css"

cd "$SRCDIR"
cp *.html *.json "$APPDIR"
cp -r "resources/vendor" $APPDIR"resources/"
cp -r "resources/app/documents" $APPDIR"resources/app/"
cp -r "resources/app/images" $APPDIR"resources/app/"
cd "$TEMPDIR"
cp js/app.js $APPDIR"resources/app/js/"
cp css/app.css $APPDIR"resources/app/css/"

echo 'Done Processing Resources'
