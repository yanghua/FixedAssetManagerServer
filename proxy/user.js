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
  Date: 11/10/13
  Time: 10:43 AM
  Desc: user - the proxy of user
 */

var User      = require("../models/user");
var mysqlUtil = require("../libs/mysqlUtil"),
mysqlClient   = mysqlUtil.getMysqlClient();

/**
 * get user info by user id
 * @param  {string}   userId   user id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getUserInfoById=function (userId, callback) {
    console.log("######getUserInfoById")

    if (typeof(userId) == "undefined" || userId.length ==0) {
        return;
    }

    mysqlClient.query({
        sql : "SELECT * FROM USER WHERE USERID = :USERID",
        params : {
            "USERID"  : userId
        }
    }, function (err, rows){
        if (err != null) {
            console.log("getUserInfoById:"+err);
        }else{
            callback(err, rows);
        }

    });
}
