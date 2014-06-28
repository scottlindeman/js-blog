#!/bin/bash

JSINDIR=$1
JSOUTDIR=$2
JSCOMPILEDFILE=$3

echo $JSINDIR

rm -r $JSOUTDIR
mkdir $JSOUTDIR

shopt -s nullglob

echo 'Accumulating JS files'
jsfiles=( "$JSINDIR"/* )
jsfiles=( "${jsfiles[@]##*/}" )

echo 'Minifying files...'
for file in "${jsfiles[@]}"
do
    echo 'Minifying '$file
    java -jar ./utils/tools/yuicompressor.jar $JSINDIR$file --type js -o $JSOUTDIR$file --verbose
    cat $JSOUTDIR$file >> $JSOUTDIR$JSCOMPILEDFILE
done

echo 'All files minified and compiled into '$JSOUTDIR$JSCOMPILEDFILE
