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
  Date: 11/10/13
  Time: 10:43 AM
  Desc: fixedAsset - the proxy of fixedAsset
 */

//mode
'use strict';

var User         = require('../models/fixedAsset');
var mysqlUtil    = require("../libs/mysqlUtil"),
    mysqlClient  = mysqlUtil.initMysql();
var EventProxy   = require("eventproxy");
var config       = require("../config").initConfig();
var SQL_PATTERN  = require("./SQLS").getSqlConfig();
                   require("../libs/DateUtil");
var qrCodeUtil   = require("../libs/qrCodeUtil");

/**
 * get fixed asset list by userId
 * @param  {string}   userId   user id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getFixedAssetListByUserID = function (userId, callback) {
    console.log("######/proxy/fixedAsset/getFixedAssetListByUserId");

    userId = userId || "";

    if (userId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql     : "SELECT * FROM fixedAsset.ASSETS " +
                  " WHERE userId =:userId",
        params  : {
            "userId"  : userId
        }
    }, function (err, rows) {
        if (err) {
            callback(new ServerError(), null);
        }
        callback(null, rows);
    });
};

/**
 * get fixed asset by faid
 * @param  {string}   faId     fixed asset id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getFixedAssetByfaID = function (faId, callback) {
    console.log("######proxy/fixedAsset/getFixedAssetByfaID");

    faId = faId || "";

    if (faId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql     : "SELECT * FROM ASSETS WHERE newId = :newId",
        params  : {
            "newId"  : faId
        }
    }, function (err, rows) {
        if (err) {
            callback(new ServerError(), null);
        }

        if (rows && rows.length > 0) {
            var data = rows[0];
            callback(null, data);
        } else {
            callback(new DataNotFoundError(), null);
        }
    });
};


/**
 * check fixed asset by faId
 * @param  {string}   faId     fixed asset id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.checkFixedAssetByfaID = function (faId, callback) {
    console.log("######proxy/checkFixedAssetByfaID");

    faId = faId || "";

    if (faId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql     : "SELECT COUNT(1) AS 'count' FROM ASSETS WHERE newId = :newId",
        params  : {
            "newId"  : faId
        }
    }, function (err, rows) {
        if (err) {
            callback(new ServerError(), null);
        } else {
            var hasFA;
            if (rows[0] && rows[0].count > 0) {
                hasFA = true;
            } else {
                hasFA = false;
            }
            callback(null, hasFA);
        }
    });
};


/**
 * reject fixed asset or not
 * @param  {object}   rejectionInfo the operate data
 * @param  {Function} callback      callback func
 * @return {null}                 
 */
exports.rejectFixedAsset = function (rejectionInfo, callback) {
    console.log("######proxy/fixedAsset/rejectFixedAsset");

    rejectionInfo = rejectionInfo || null;

    if (!rejectionInfo) {
        return callback(new InvalidParamError(), null);
    }

    var rejectionObj = {};
    rejectionObj["newId"] = rejectionInfo["faId"];
    rejectionObj["reject"] = rejectionInfo["reject"];
    rejectionObj["rejectDate"] = new Date().Format("yyyy-MM-dd");

    mysqlClient.query({
        sql     : "UPDATE ASSETS SET reject=:reject, rejectDate=:rejectDate WHERE newId = :newId",
        params  : rejectionObj
    }, function (err, rows) {
        if (err || !rows) {
            callback(new ServerError(), null);
        } else if (rows.affectedRows === 0) {
            callback(new DataNotFoundError(), null);
        } else {
            callback(null, rows);
        }
    });
};


/**
 * get fixed asset detail
 * @param  {string}   faId     the fixed asset id
 * @param  {string}   faType   the fixed asset type
 * @param  {Function} callback the callback func
 * @return {null}            
 */
exports.getFixedAssetDetail = function (faId, faType, callback) {
    console.log("######proxy/fixedAsset/getFixedAssetDetail");

    faId   = faId || "";
    faType = faType || "";

    if (faId.length === 0 || faType.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql     : "SELECT * FROM " + faType + " WHERE newId = :newId",
        params  : {
            "newId"  : faId
        }
    }, function (err, rows) {
        if (err) {
            callback(new ServerError(), null);
        } else {
            callback(null, rows);
        }
    });
};

/**
 * modify fixed asset
 * @param  {object}   faDetailObj the detail object of the fixed asset
 * @param  {string}   faId        the fixed asset id
 * @param  {Function} callback    the callback func
 * @return {null}               
 */
exports.modifyFixedAsset = function (faDetailObj, faId, callback) {
    console.log("######proxy/fixedAsset/modifyFixedAsset");

    mysqlClient.query({
        sql     : "UPDATE ASSETS SET    " +
                  "                 oldId=:oldId, " +
                  "                 userId=:userId, " +
                  "                 departmentId=:departmentId,     " +
                  "                 typeId=:typeId,                 " +
                  "                 assetName=:assetName,           " +
                  "                 assetBelong=:assetBelong,       " +
                  "                 currentStatus=:currentStatus,   " +
                  "                 brand=:brand,                   " +
                  "                 model=:model,                   " +
                  "                 specifications=:specifications, " +
                  "                 amount=:amount,                 " +
                  "                 price=:price,                   " +
                  "                 purchaseDate=:purchaseDate,     " +
                  "                 possessDate=:possessDate,       " +
                  "                 serviceCode=:serviceCode,       " +
                  "                 mac=:mac,                       " +
                  "                 reject=:reject,                 " +
                  "                 rejectDate=:rejectDate,         " +
                  "                 remark1=:remark1,               " +
                  "                 remark2=:remark2                " +
                  " WHERE newId = :newId",
        params  : faDetailObj
    }, function (err, rows) {
        if (err || !rows) {
            console.dir(err);
            return callback(new ServerError(), null);
        }

        if (rows.affectedRows === 0) {
            return callback(new DataNotFoundError(), null);
        }

        callback(null, rows);
    });
};


/**
 * add a new fixed asset
 * @param {object}   faDetailObj the fixed asset object
 * @param {Function} callback    the callback func
 */
exports.addFixedAsset = function (faDetailObj, callback) {
    console.log("######proxy/addFixedAsset");

    var eq = EventProxy.create();

    qrCodeUtil.getQRData(faDetailObj.newId, function (err, encodedStr) {
        if (err) {
            console.dir("Error :" + err);
            return eq.emitLater("error", new ServerError());
        }

        if (encodedStr) {
            eq.emitLater("after_getQRData", encodedStr);
        }
    });

    eq.once("after_getQRData", function (encodedStr) {
        faDetailObj["qrcode"] = encodedStr;

        console.dir(faDetailObj);

        mysqlClient.query({
            sql         : "INSERT INTO ASSETS VALUES(:newId,                " +
                          "                             :oldId,             " +
                          "                             :userId,            " +
                          "                             :departmentId,      " +
                          "                             :typeId,            " +
                          "                             :assetName,         " +
                          "                             :assetBelong,       " +
                          "                             :currentStatus,     " +
                          "                             :brand,             " +
                          "                             :model,             " +
                          "                             :specifications,    " +
                          "                             :amount,            " +
                          "                             :price,             " +
                          "                             :purchaseDate,      " +
                          "                             :possessDate,       " +
                          "                             :serviceCode,       " +
                          "                             :mac,               " +
                          "                             :reject,            " +
                          "                             :rejectDate,        " +
                          "                             :remark1,           " +
                          "                             :remark2,           " +
                          "                             :qrcode)",
            params      : faDetailObj
        }, function (err, rows) {
            if (err || !rows) {
                console.dir(err);
                return eq.emitLater("error", new ServerError());
            }

            if (rows.affectedRows === 0) {
                return eq.emitLater("error", new DataNotFoundError());
            }

            return callback(null, null);
        });
    });

    eq.fail(function (err) {
        return callback(err, null);
    });

};


/**
 * allocate fixed asset
 * @param  {string}   faId     fixed asset id
 * @param  {string}   userId   user id
 * @param  {Function} callback the callback func
 * @return {null}            
 */
exports.allocateFixedAsset = function (faId, userId, callback) {
    console.log("######proxy/fixedAsset/allocateFixedAsset");

    mysqlClient.query({
        sql         : "UPDATE EQUIPMENT SET lastUserId=:lastUserId, possessDate=:possessDate " +
                      " WHERE equipmentId=:equipmentId",
        params      : {
            lastUserId      : userId,
            possessDate     : new Date().Format("yyyy-MM-dd"),
            equipmentId     : faId
        }
    }, function (err, rows) {
        if (err || !rows) {
            console.dir(err);
            return callback(new ServerError(), null);
        }

        if (rows.affectedRows === 0) {
            return callback(new ServerError(), null);
        }

        callback(null, null);
    });
};
