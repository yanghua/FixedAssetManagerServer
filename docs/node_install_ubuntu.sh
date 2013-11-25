#!/bin/bash
#-*- utf-8 -*-

#Created by : yanghua
#Date       : 16/10/2013
#Desc       : a script to install node.js for ubuntu

echo "It is installing node... "
sudo apt-get install python-software-properties python g++ make
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs

echo "installing... pm2"
npm install -g pm2

echo "set NODE_ENV, default is deveploment...."
echo export NODE_ENV=development >> ~/.bash_profile
source ~/.bash_profile && . ~/.bash_profile
echo "the NODE_ENV is :"
echo $NODE_ENV