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
  Date: 7/11/13
  Time: 17:03 PM
  Desc: login - the proxy of login
 */

var mysqlClient = require("../libs/mysqlUtil");

var EventProxy  = require("eventproxy");
var config      = require("../config").initConfig();
                   require("../libs/DateUtil");

/**
 * get user auth info by user id
 * @param  {userId}   user id
 * @param  {Function} callback call back
 * @return {null}            
 */
exports.getUserAuthInfoByUserId = function(userId, callback) {
    debugProxy("/proxy/login/getUserAuthInfoByUserId");

    userId = userId || "";

    if (userId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql     : "SELECT * FROM fixedAsset.AUTHUSER " +
                  " WHERE uid =:uid",
        params  : {
            "uid"  : userId
        }
    }, function (err, rows) {
        if (err || !rows) {
            return callback(new ServerError(), null);
        }

        if (rows.length > 0) {
            callback(null, rows[0]);
        } else {
            callback(null, null);
        }
        
    });
};

