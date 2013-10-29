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
var HostComputer = require("./hostComputer");
var mysqlUtil    = require("../libs/mysqlUtil"),
    mysqlClient  = mysqlUtil.initMysql();
var EventProxy   = require("eventproxy");
var config       = require("../config").initConfig();
var SQL_PATTERN  = require("./SQLS").getSqlConfig();

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
        sql     : "SELECT * FROM fixedAsset.EQUIPMENT EQ " +
                  " WHERE lastUserId =:lastUserId",
        params  : {
            "lastUserId"  : userId
        }
    }, function (err, rows) {
        if (err) {
            callback(new ServerError(), null);
        }
        callback(null, rows);
    });
};

/**
 * get fixed asset detail by faid
 * @param  {string}   faId     fixed asset id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getFixedAssetByfaID = function (faId, callback) {
    console.log("######proxy/fixedAsset/getFixedAssetDetailByfaID");

    faId = faId || "";

    if (faId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql     : "SELECT * FROM EQUIPMENT WHERE EQUIPMENTID = :EQUIPMENTID",
        params  : {
            "EQUIPMENTID"  : faId
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
 * get fixed asset by faid
 * @param  {string}   faId     fixed asset id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getFixedAssetDetailByfaID = function (faId, callback) {
    console.log("######proxy/fixedAsset/getFixedAssetByfaID");

    faId = faId || "";

    if (faId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    var eq = EventProxy.create();

    mysqlClient.query({
        sql     : "SELECT * FROM EQUIPMENT WHERE EQUIPMENTID = :EQUIPMENTID",
        params  : {
            "EQUIPMENTID"  : faId
        }
    }, function (err, rows) {
        if (err) {
            return eq.emitLater("error", new ServerError());
        }
        if (rows && rows.length > 0) {
            eq.emitLater("afterFAType_proxy", rows[0]);
        } else {
            return eq.emitLater("error", new DataNotFoundError());
        }
    });

    eq.once("afterFAType_proxy", function (faInfo) {

        //split with equipment type
        if (faInfo.equipmentSqlName === config.faType.ENUM_HC) {
            require("./fixedAsset").getFixedAssetDetail(faInfo.equipmentId, config.faType.ENUM_HC, function (err, rows) {
                if (err) {
                    return eq.emitLater("error", new ServerError());
                }

                if (rows.length === 0) {
                    return eq.emitLater("error", new DataNotFoundError());
                }
                var faAll = {};
                faAll["faInfo"] = faInfo;
                faAll["faDetail"] = rows[0];

                eq.emitLater("afterFADetail_proxy", faAll);
            });
        }
    });

    eq.once("afterFADetail_proxy", function (rows) {
        console.log("afterFADetail_proxy");
        callback(null, rows);
    });

    //error handler
    eq.fail(function (err) {
        callback(err, null);
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
        sql     : "SELECT COUNT(1) AS 'count' FROM EQUIPMENT WHERE EQUIPMENTID = :EQUIPMENTID",
        params  : {
            "EQUIPMENTID"  : faId
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

    mysqlClient.query({
        sql     : "UPDATE EQUIPMENT SET reject=:reject WHERE equipmentId = :equipmentId",
        params  : rejectionInfo
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
 * modify fixed asset detail
 * @param  {object}   faObj    the fixed asset detail
 * @param  {Function} callback the callback func
 * @return {null}            
 */
// exports.modifyFixedAssetDetail = function (faObj, callback) {
//     console.log("######proxy/fixedAsset/modifyFixedAssetDetail");
//     mysqlClient.query({
//         sql     : SQL_PATTERN_CONFIG[ faObj.faType + "_MODIFY" ],
//         params  : faObj
//     }, function (err, rows) {
//         if (err) {
//             callback(new ServerError(), null);
//         } else {
//             callback(null, rows);
//         }
//     });
// };
// 

exports.addNewFixedAssetDetail = function (faDetailObj, faType, callback) {
    console.log("######proxy/addNewFixedAssetDetail");

    var sqlPattern = "";

    if (faType === config.faType.ENUM_HC) {
        sqlPattern = SQL_PATTERN["HOSTCOMPUTER_INSERT"];
    } else if (faType === config.faType.ENUM_MOB) {
        sqlPattern = SQL_PATTERN["MOBILE_INSERT"];
    } else if (faType === config.faType.ENUM_MON) {
        sqlPattern = SQL_PATTERN["MONITOR_INSERT"];
    } else if (faType === config.faType.ENUM_NOT) {
        sqlPattern = SQL_PATTERN["NOTEBOOK_INSERT"];
    } else if (faType === config.faType.ENUM_OE) {
        sqlPattern = SQL_PATTERN["OFFICEEQUIPMENT_INSERT"];
    } else if (faType === config.faType.ENUM_OF) {
        sqlPattern = SQL_PATTERN["OFFICEFURNITURE_INSERT"];
    } else if (faType === config.faType.ENUM_OTE) {
        sqlPattern = SQL_PATTERN["OTHEREQUIPMENT_INSERT"];
    } else if (faType === config.faType.ENUM_SERVER) {
        sqlPattern = SQL_PATTERN["SERVER_INSERT"];
    } else if (faType === config.faType.ENUM_VE) {
        sqlPattern = SQL_PATTERN["VIRTUALEQUIPMENT_INSERT"];
    } else {
        return callback(new InvalidParamError(), null);
    }

    // console.dir("sql pattern for addNewFixedAssetDetail:"+sqlPattern);

    mysqlClient.query({
        sql         : sqlPattern,
        params      : faDetailObj
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
