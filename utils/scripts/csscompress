#!/bin/bash

CSSINDIR=$1
CSSOUTDIR=$2
CSSCOMPILEDFILE=$3

rm -r $CSSOUTDIR
mkdir $CSSOUTDIR

shopt -s nullglob

echo 'Accumulating CSS files'
cssfiles=( "$CSSINDIR"/* )
cssfiles=( "${cssfiles[@]##*/}" )
echo $cssfiles


echo 'Minifying files...'
for file in "${cssfiles[@]}"
do
    echo 'Minifying '$file
    java -jar ./utils/tools/yuicompressor.jar $CSSINDIR$file --type css -o $CSSOUTDIR$file --verbose
    cat $CSSOUTDIR$file >> $CSSOUTDIR$CSSCOMPILEDFILE
done

echo 'All files minified and compiled into '$CSSOUTDIR$CSSCOMPILEDFILE
