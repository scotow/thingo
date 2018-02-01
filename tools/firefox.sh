#!/bin/bash

DES=dist/build/thingo.firefox
rm -rf $DES
mkdir -p $DES

cp -R src/css               $DES/
# cp -R src/img               $DES/
cp -R src/js                $DES/
cp -R src/lib               $DES/
cp src/*.html               $DES/
cp -R assets                $DES/
cp -R platform/chromium/img $DES/
cp platform/chromium/*.json $DES/
cp LICENSE.txt              $DES/

pushd $(dirname $DES/) > /dev/null
zip thingo.firefox.zip -qr $(basename $DES/)/*
popd > /dev/null
