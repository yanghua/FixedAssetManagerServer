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
  Desc: fixedAsset - the proxy of fixedAsset
 */

var User = require('../models/fixedAsset');

var mysqlUtil  = require("../libs/mysqlUtil"),
mysqlClient    = mysqlUtil.getMysqlClient();

/**
 * get fixed asset list by userId
 * @param  {string}   userId   user id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getFixedAssetListByUserId = function (userId, callback){
    console.log("######getFixedAssetListByUserId");

    if (typeof(userId) == "undefined" || userId.length ==0) {
        return;
    }

    mysqlClient.query({
        sql     : "SELECT * FROM USERASSETS WHERE USERID = :USERID",
        params  : {
            "USERID"  : userId
        }
    }, function (err, rows){
        if (err != null) {
            console.log("getFixedAssetListByUserId:"+err);
        }else{
            callback(err, rows);
        }

    });
};

/**
 * get fixed asset by faid
 * @param  {string}   faId     fixed asset id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getFixedAssetByfaID = function (faId, callback){
    console.log("######getFixedAssetByfaID");

    if (typeof(faId) == "undefined" || faId.length == 0) {
        return;
    }

    mysqlClient.query({
        sql     : "SELECT * FROM USERASSETS WHERE ASSETSID = :ASSETSID",
        params  : {
            "ASSETSID"  : faId
        }
    }, function (err, rows){
        if (err != null) {
            console.log("getFixedAssetByfaID:"+err);
        }else{
            callback(err, rows);
        }
    });
};

/**
 * get fixed asset list by fa type
 * @param  {string}   faTypeId   fixed asset type
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getFixedAssetListByfaType = function (faTypeId, callback){
    console.log("######getFixedAssetListByfaType");

    mysqlClient.query({
        sql     : "SELECT * FROM USERASSETS WHERE EQUIPMENTTYPEID = :EQUIPMENTTYPEID",
        params  : {
            "ASSETSID"  : faTypeId
        }
    }, function (err, rows){
        if (err != null) {
            console.log("getFixedAssetListByfaType:"+err);
        }else{
            callback(err, rows);
        }
    });
}

/**
 * modify fixed asset info 
 * @param  {object}   faObj    fixed asset object
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.modifyFixedAssetInfoBYfaId = function (faObj, callback){
    console.log("######modifyFixedAssetInfoBYFAId");

    mysqlClient.query({
        sql     : "UPDATE USERASSETS SET  USERID          = :USERID,          " +
                  "                       EQUIPMENTTYPEID = :EQUIPMENTTYPEID  " +
                  "  WHERE ASSETSID = :ASSETSID",
        params  : {
            "ASSETSID"        : faObj.faId,
            "USERID"          : faObj.faOwnerId,
            "EQUIPMENTTYPEID" : faObj.faTypeId
        }
    }, function (err, rows){
        if (err != null) {
            console.log("modifyFixedAssetInfoBYfaId:"+err);
        }else{
            callback(err, rows);
        }
    });
}