/*
  #!/usr/local/bin/node
  -*- coding:utf-8 -*-
 
  Copyright 2013 yanghua Inc. All Rights Reserved.
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
     http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  ---
  Created with Sublime Text 2.
  User: yanghua
  Date: 14/10/13
  Time: 14:30 AM
  Desc: mysqlUtil - the helper of mysql
 */

var Client = require("easymysql");
var config = require("../config").initConfig();
var mysql  = null;
var inited = false;


/**
 * init mysql
 * @return {null} 
 */
function initMysql () {
    mysql = Client.create({
        'maxconnections' : config.default_max_conns
    });

    mysql.addserver(config.mysqlConfig);

    mysql.on('busy', function(queuesize, maxconnections, which){
        console.log('mysql is busy');
    });

    mysql.query('USE fixedAsset', function(err, results){
        if (err) {
            console.log("USE fixedAsset Error:"+err.message);
            inited = false;
        }else{
            inited = true;
        }
    });
}

/**
 * get mysql client
 * @return {object} mysql client
 */
exports.getMysqlClient=function (){
    if (!inited) {
        initMysql();
    }

    return mysql;
}