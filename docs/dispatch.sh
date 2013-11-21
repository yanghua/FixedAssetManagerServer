#!/bin/bash
#-*- utf-8 -*-

#Created by : yanghua
#Date       : 16/10/2013
#Desc       : a script to install FixedAssetManager_Server

npm install -g pm2

rm -R FixedAssetManager_Server

git clone git://github.com/yanghua/FixedAssetManager_Server.git

cd FixedAssetManager_Server

npm install

pm2 stop all
pm2 start app.js -x -f