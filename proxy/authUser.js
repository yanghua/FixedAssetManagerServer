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
var EventProxy  = require("eventproxy");

/**
 * create a user
 * @param  {object}   userInfo the instance of user
 * @param  {Function} callback the call back func
 * @return {null}            
 */
exports.create = function (userInfo, callback) {
    debugProxy("/proxy/authUser/create");

    if (!(userInfo.uid && userInfo.pwd && userInfo.token && userInfo.token && userInfo.uName)) {
        return callback(new InvalidParamError(), null);
    }

    var ep = EventProxy.create();
    //check user exists
    require("./authUser").checkUserExists(userInfo.uid, function (err, isUserExist) {
        if (err) {
            return ep.emitLater("error", new ServerError());
        }

        return ep.emitLater("after_checkUserExists", isUserExist);
    });

    ep.once("after_checkUserExists", function (isUserExist) {
        debugProxy("isUserExist: " + isUserExist);
        if (!isUserExist) {
            //add
            mysqlClient.query({
                sql     : "INSERT INTO AUTHUSER VALUES(:uid, :pwd, :token, :lastLoginTime, :uName)",
                params  : userInfo
            },  function (err, rows) {
                if (err || !rows || rows.affectedRows === 0) {
                    debugProxy(err);
                    console.dir(rows);
                    return callback(new ServerError(), null);
                }

                return callback(null, null);
            });
        } else {
            return callback(new ServerError(), null);
        }
    });

    //error handler
    ep.fail(function (err) {
        return callback(err, null);
    });
};

/**
 * modify password
 * @param  {Object}   userInfo the new password info
 * @param  {Function} callback the cb func
 * @return {null}            
 */
exports.modifyPwd = function (userInfo, callback) {
    debugProxy("/proxy/authUser/modifyPwd");

    mysqlClient.query({
        sql     : "UPDATE AUTHUSER SET pwd = :pwd WHERE uid = :uid",
        params  : userInfo
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new ServerError(), null);
        }

        return callback(null, null);
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

/**
 * check user exists
 * @param  {String}   uid      the user's id
 * @param  {Function} callback the cb func
 * @return {null}            
 */
exports.checkUserExists = function (uid, callback) {
    debugProxy("/proxy/authUser/checkUserExists");

    if (!uid) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql     : "SELECT COUNT(1) as 'count' FROM AUTHUSER WHERE uid = :uid",
        params  : { uid : uid }
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new ServerError(), null);
        }

        return callback(null, rows[0].count != 0);
    });
};
