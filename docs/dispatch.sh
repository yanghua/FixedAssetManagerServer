#!/bin/bash
#-*- utf-8 -*-

#Created by : yanghua
#Date       : 16/10/2013
#Desc       : a script to install FixedAssetManager_Server

cd ~

rm -R FixedAssetManager_Server

git clone git://github.com/yanghua/FixedAssetManager_Server.git

cd FixedAssetManager_Server

npm install

#generate assets for static resource
make build

#give the uploads dir the write premission
sudo chmod o+w uploads

#give the backup dir the other user write premission
sudo chmod o+w backup

pm2 kill
#make sure you have setted 'NODE_ENV'
#more detail see: docs/node_install_ubuntu.sh
NODE_ENV=$NODE_ENV pm2 start app.js -x -f