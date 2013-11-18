#!/bin/bash
#-*- utf-8 -*-

#Created by : yanghua
#Date       : 16/10/2013
#Desc       : a script to install node.js for ubuntu

#note that:
#it's a node module for handling canvas/image ...
#before installing this, make sure that you have installed node.js (>= 0.4.2) and npm
#reference:https://github.com/LearnBoost/node-canvas/wiki/Installation---Ubuntu
echo "It is installing node-canvas...."
echo "Installing dependencies...."
sudo apt-get update
sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
echo "Installing node-canvas...."
sudo npm install canvas