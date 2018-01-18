#!/bin/bash

DES=dist/build/thingo.chromium
rm -rf $DES
mkdir -p $DES

cp -R src/css               $DES/
cp -R src/img               $DES/
cp -R src/js                $DES/
cp -R src/lib               $DES/
cp src/*.html               $DES/
cp LICENSE.txt              $DES/
