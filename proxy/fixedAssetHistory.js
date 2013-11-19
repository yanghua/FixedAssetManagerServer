/*
  #!/usr/local/bin/node
  -*- coding:utf-8 -*-
 
  Copyright 2013 yanghua Inc. All Rights Reserved.
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file exceqt in compliance with the License.
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
  Date: 13/11/13
  Time: 10:43 AM
  Desc: fixedAssetHistory - the proxy of fixedAsset history
 */

//mode
'use strict';

var mysqlUtil    = require("../libs/mysqlUtil"),
    mysqlClient  = mysqlUtil.initMysql();
var EventProxy   = require("eventproxy");
var config       = require("../config").initConfig();
                   require("../libs/DateUtil");
var util         = require("../libs/util");


/**
 * insert a history record item
 * @param  {object}   recordItem the inserting record
 * @param  {Function} callback   the callback func
 * @return {null}              
 */
exports.insertHistoryRecord = function (recordItem, callback) {
    console.log("######/proxy/fixedAssetHistory/insertHistoryRecord");

    recordItem["aetId"] = util.GUID();
    
    mysqlClient.query({
        sql     : "INSERT INTO ASSETEVENT VALUES(:aetId, :aetpId, :atId, :userId, :aeDesc, :aeTime)",
        params  : recordItem
    }, function (err, rows) {
        if (err) {
            console.dir("error" + err);
            return callback(new ServerError(), null);
        }

        callback(null, null);
    })
};

/**
 * get history list by faId
 * @param  {string}   faId     fixed asset id
 * @param  {Function} callback the callback func
 * @return {null}            
 */
exports.getHistoryListByFAId = function (faId, callback) {
    console.log("######/proxy/fixedAssetHistory/getHistoryListByFAId");

    console.log(faId);

    mysqlClient.query({
        sql     : "SELECT ae.*,u.userName,aet.aetName FROM ASSETEVENT ae " +
                  "  LEFT JOIN ASSETEVENTYPE aet " +
                  "    ON ae.aetpId = aet.aetId " +
                  "  LEFT JOIN USER u " +
                  "    ON ae.userId = u.userId " +
                  " WHERE atId = :atId ",
        params  : {
            atId    : faId
        }
    }, function(err, rows) {
        if (err) {
            console.dir("error:" + err);
            return callback(new ServerError(), null);
        }

        callback(null, rows);
    });

};