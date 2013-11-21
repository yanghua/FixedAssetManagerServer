#!/bin/bash
#-*- utf-8 -*-

#Created by : yanghua
#Date       : 16/10/2013
#Desc       : a script to install mysql from source code for ubuntu

cd ~

echo "downloading mysql 5.6.14...."
# sudo wget https://dev.mysql.com/get/Downloads/MYSQL-5.6/mysql-5.6.14-linux-glibc2.5-x86_64.tar.gz

echo "install libaio1..."
sudo apt-get install libaio1

echo "add a mysql group..."
sudo groupadd mysql

echo "add  a account mysql into mysql group ..."
sudo useradd -r -g mysql mysql

echo "extracting the mysql file..."
dir_mysql_file=/usr/local/mysql-5.6.14
 
cd /usr/local

sudo mkdir $dir_mysql_file
sudo ln -s $dir_mysql_file mysql

tar zxvf ~/mysql-5.6.14-linux-glibc2.5-x86_64.tar.gz
sudo mv mysql-5.6.14-linux-glibc2.5-x86_64/* $dir_mysql_file
rm -r mysql-5.6.14-linux-glibc2.5-x86_64

cd mysql

root_dir=`pwd`

if [ $root_dir = /usr/local/mysql ]; then
        sudo chown -R mysql .
        sudo chgrp -R mysql .
fi        

echo "initializing the db"
sudo scripts/mysql_install_db --user=mysql 

echo "change the owner of the folder..."
if [ $root_dir = /usr/local/mysql ];then
 echo "setting owner of the folder"
 sudo chown -R root .
 sudo chown -R mysql data
fi

echo "cp mysql's config file..."
sudo cp support-files/my-medium.cnf /etc/my.cnf

echo "cp mysql.server script..."
sudo cp support-files/mysql.server /etc/init.d/mysql.server

echo "starting mysql...."
sudo bin/mysqld_safe --user=mysql &

echo "setting account...."
sudo bin/mysqladmin -u root password '123456'

echo "check mysql status:"
echo "sudo /etc/init.d/mysql.server status"

echo "start mysql:"
echo "sudo /etc/init.d/mysql.server start"

echo "stop mysql:"
echo "sudo /etc/init.d/mysql.server stop"
