/*
  #!/usr/local/bin/node
  -*- coding:utf-8 -*-
 
  Copyright 2013 freedom Inc. All Rights Reserved.
 
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
  Date: Dec 5, 2013
  Time: 9:58 AM
  Desc: the proxy of auth user
 */

var mysqlClient = require("../libs/mysqlUtil");
var SHA256      = require("crypto-js/sha256");

/**
 * create a user
 * @param  {object}   userInfo the instance of user
 * @param  {Function} callback the call back func
 * @return {null}            
 */
exports.create = function (userInfo, callback) {
    debugProxy("/proxy/authUser/create");
    mysqlClient.query({
        sql     : "INSERT INTO AUTHUSER VALUES(:uid, :pwd, :uName)",
        params  : {
            uid   : userInfo.uid,
            pwd   : SHA256(userInfo.pwd),
            uName : userInfo.uName
        }
    },  function (err, rows) {
        if (err || !rows || rows.affectedRows === 0) {
            return callback(new ServerError(), null);
        }

        callback(null, null);
    });
};

/**
 * get all users
 * @param  {Function} callback the call back func
 * @return {null}            
 */
exports.getAllUsers = function (callback) {
    debugProxy("/proxy/authUser/getAllUsers");
    mysqlClient.query({
        sql       : "SELECT * FROM AUTHUSER WHERE uid != 'admin'",
        params    : null
    },function (err, rows) {
        if (err || !rows) {
            return callback(new ServerError(), null);
        }

        callback(null, rows);
    });
};
