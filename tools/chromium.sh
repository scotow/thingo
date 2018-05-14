#!/bin/bash

DES=dist/build/thingo.chromium
rm -rf $DES
mkdir -p $DES

cp -R src/css               $DES/
cp -R src/images            $DES/
cp -R src/js                $DES/
cp -R src/lib               $DES/
cp src/*.html               $DES/
# cp -R assets                $DES/
# cp platform/chromium/*.js   $DES/js/
cp -R platform/chromium/img $DES/
# cp platform/chromium/*.html $DES/
cp platform/chromium/*.json $DES/
cp LICENSE.txt              $DES/

pushd $(dirname $DES/) > /dev/null
zip thingo.chromium.zip -qr $(basename $DES/)/*
popd > /dev/null
