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

var User = require('../models/fixedAsset');
var mysqlClient = require("../libs/mysqlUtil");
var EventProxy = require("eventproxy");
var config = require("../config").initConfig();
require("../libs/DateUtil");
var QRCode = require("qrcode");

/**
 * get fixed asset list by userId
 * @param  {string}   userId   user id
 * @param  {Function} callback callback func
 * @return {null}
 */
exports.getFixedAssetListByUserID = function(userId, callback) {
    debugProxy("/proxy/fixedAsset/getFixedAssetListByUserId");

    userId = userId || "";

    if (userId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql: "SELECT * FROM fixedAsset.ASSETS " +
            " WHERE userId =:userId",
        params: {
            "userId": userId
        }
    }, function(err, rows) {
        if (err) {
            return callback(new ServerError(), null);
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
exports.getFixedAssetByfaID = function(faId, callback) {
    debugProxy("proxy/fixedAsset/getFixedAssetByfaID");

    faId = faId || "";

    if (faId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    var ep = EventProxy.create();

    mysqlClient.query({
        sql: "SELECT * FROM ASSETS WHERE newId = :newId",
        params: {
            "newId": faId
        }
    }, function(err, rows) {
        if (err) {
            return ep.emitLater("error", new ServerError());
        }

        var faInfo = {};
        if (rows && rows.length > 0) {
            var faDetail = rows[0];
            faInfo.faDetail = faDetail;
            ep.emitLater("after_getFAInfo", faInfo);
        } else {
            return ep.emitLater("error", new DataNotFoundError());
        }
    });

    ep.once("after_getFAInfo", function(faInfo) {

        faInfo.faDetail.userId = faInfo.faDetail.userId || "";

        if (faInfo.faDetail.userId.length !== 0) {
            mysqlClient.query({
                sql: "SELECT * FROM USER WHERE userId = :userId",
                params: {
                    "userId": faInfo.faDetail.userId
                }
            }, function(err, rows) {
                if (err) {
                    return ep.emitLater("error", new ServerError());
                }

                var userInfo = {};
                if (rows && rows.length > 0) {
                    userInfo = rows[0];
                }

                faInfo.userInfo = userInfo;
                ep.emitLater("after_getUserInfo", faInfo);
            });
        } else {
            ep.emitLater("after_getUserInfo", faInfo);
        }

    });

    ep.once("after_getUserInfo", function(faInfo) {
        faInfo.faDetail.departmentId = faInfo.faDetail.departmentId || "";

        if (faInfo.faDetail.departmentId.length !== 0) {
            mysqlClient.query({
                sql: "SELECT * FROM DEPARTMENT WHERE departmentId = :departmentId",
                params: {
                    "departmentId": faInfo.faDetail.departmentId
                }
            }, function(err, rows) {
                if (err) {
                    return ep.emitLater("error", new ServerError());
                }

                var deptInfo = {};
                if (rows && rows.length > 0) {
                    deptInfo = rows[0];
                    faInfo.deptInfo = deptInfo;
                }

                ep.emitLater("after_getDeptInfo", faInfo);
            });
        } else {
            ep.emitLater("after_getDeptInfo", faInfo);
        }

    });

    ep.once("after_getDeptInfo", function(faInfo) {
        faInfo.faDetail.typeId = faInfo.faDetail.typeId || "";

        if (faInfo.faDetail.typeId.length !== 0) {
            mysqlClient.query({
                sql: "SELECT * FROM ASSETTYPE WHERE typeId = :typeId",
                params: {
                    "typeId": faInfo.faDetail.typeId
                }
            }, function(err, rows) {
                if (err) {
                    return ep.emitLater("error", new ServerError());
                }

                var typeInfo = {};
                if (rows && rows.length > 0) {
                    typeInfo = rows[0];
                    faInfo.typeInfo = typeInfo;
                }

                callback(null, faInfo);
            });
        } else {
            callback(null, faInfo);
        }
    });

    ep.fail(function(err) {
        return callback(err, null);
    });
};


/**
 * check fixed asset by faId
 * @param  {string}   faId     fixed asset id
 * @param  {Function} callback callback func
 * @return {null}
 */
exports.checkFixedAssetByfaID = function(faId, callback) {
    debugProxy("proxy/fixedAsset/checkFixedAssetByfaID");

    faId = faId || "";

    if (faId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql: "SELECT COUNT(1) AS 'count' FROM ASSETS WHERE newId = :newId",
        params: {
            "newId": faId
        }
    }, function(err, rows) {
        if (err) {
            return callback(new ServerError(), null);
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
exports.rejectFixedAsset = function(rejectionInfo, callback) {
    debugProxy("proxy/fixedAsset/rejectFixedAsset");

    rejectionInfo = rejectionInfo || null;

    if (!rejectionInfo) {
        return callback(new InvalidParamError(), null);
    }

    var rejectionObj = {};
    rejectionObj.newId = rejectionInfo.faId;
    rejectionObj.reject = rejectionInfo.reject;
    rejectionObj.rejectDate = new Date().Format("yyyy-MM-dd");

    mysqlClient.query({
        sql: "UPDATE ASSETS SET reject=:reject, rejectDate=:rejectDate WHERE newId = :newId",
        params: rejectionObj
    }, function(err, rows) {
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
exports.getFixedAssetDetail = function(faId, faType, callback) {
    debugProxy("proxy/fixedAsset/getFixedAssetDetail");

    faId = faId || "";
    faType = faType || "";

    if (faId.length === 0 || faType.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    mysqlClient.query({
        sql: "SELECT * FROM " + faType + " WHERE newId = :newId",
        params: {
            "newId": faId
        }
    }, function(err, rows) {
        if (err) {
            callback(new ServerError(), null);
        } else {
            callback(null, rows);
        }
    });
};

/**
 * recycle fixed asset
 * @param  {String}   faId     the fixed asset id
 * @param  {Function} callback the call back func
 * @return {null}
 */
exports.recycleFixedAsset = function(faId, callback) {
    debugProxy("proxy/fixedAsset/recycleFixedAsset");

    mysqlClient.query({
        sql: "UPDATE ASSETS SET userId='' " +
            " WHERE newId = :newId",
        params: {
            newId: faId
        }
    }, function(err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new ServerError(), null);
        }

        if (rows.affectedRows === 0) {
            return callback(new DataNotFoundError(), null);
        }

        callback(null, null);
    });
};

/**
 * modify fixed asset
 * @param  {object}   faDetailObj the detail object of the fixed asset
 * @param  {string}   faId        the fixed asset id
 * @param  {Function} callback    the callback func
 * @return {null}
 */
exports.modifyFixedAsset = function(faDetailObj, faId, callback) {
    debugProxy("proxy/fixedAsset/modifyFixedAsset");

    mysqlClient.query({
        sql: "UPDATE ASSETS SET    " +
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
        params: faDetailObj
    }, function(err, rows) {
        if (err || !rows) {
            debugProxy(err);
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
exports.addFixedAsset = function(faDetailObj, callback) {
    debugProxy("proxy/fixedAsset/addFixedAsset");

    mysqlClient.query({
        sql: "INSERT INTO ASSETS VALUES(       :newId,             " +
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
            "                             :price,             " +
            "                             :purchaseDate,      " +
            "                             :possessDate,       " +
            "                             :serviceCode,       " +
            "                             :mac,               " +
            "                             :reject,            " +
            "                             :rejectDate,        " +
            "                             :remark1,           " +
            "                             :remark2,           " +
            "                             :qrcode,            " +
            "                             :companyId)",
        params: faDetailObj
    }, function(err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new ServerError(), null);
        }

        if (rows.affectedRows === 0) {
            return callback(new DataNotFoundError(), null);
        }

        return callback(null, null);
    });

};


/**
 * allocate fixed asset
 * @param  {object}   allocatingObj     the object of allocating fixed asset
 * @param  {Function} callback the callback func
 * @return {null}
 */
exports.allocateFixedAsset = function(allocatingObj, callback) {
    debugProxy("proxy/fixedAsset/allocateFixedAsset");

    allocatingObj.possessDate = new Date().Format("yyyy-MM-dd");

    console.log(allocatingObj);

    mysqlClient.query({
        sql: "UPDATE ASSETS SET userId=:userId, possessDate=:possessDate, " +
            "                  departmentId=:departmentId" +
            " WHERE newId=:newId",
        params: allocatingObj
    }, function(err, rows) {
        debugProxy("###" + err);
        if (err || !rows) {
            return callback(new ServerError(), null);
        }

        if (rows.affectedRows === 0) {
            return callback(new ServerError(), null);
        }

        callback(null, null);
    });
};

/**
 * get qrCode by page index
 * @param {int} pageIndex the page index
 * @param {String} timefrom time from
 * @param {String} timeto time to
 * @param  {Function} callback the callback func
 * @return {null}
 */
exports.getqrCodeByPageIndex = function(pageIndex, timefrom, timeto, callback) {
    debugProxy("proxy/fixedAsset/getAllqrCode");

    var sql = "";
    var paramsObj = {
        start: ((pageIndex - 1) * config.default_page_size),
        end: config.default_page_size
    };

    if (timefrom.length === 0) {
        sql = "SELECT newId, t.typeName FROM fixedAsset.ASSETS a " +
            "LEFT JOIN fixedAsset.ASSETTYPE t " +
            "ON a.typeId = t.typeId " +
            "ORDER BY purchaseDate DESC " +
            "LIMIT :start,:end ";
    } else if (timefrom.length !== 0 && timeto.length !== 0) {
        sql = "SELECT newId, t.typeName FROM fixedAsset.ASSETS a " +
            "LEFT JOIN fixedAsset.ASSETTYPE t " +
            "ON a.typeId = t.typeId " +
            " WHERE purchaseDate BETWEEN :timeFrom AND :timeTo " +
            "ORDER BY purchaseDate DESC " +
            "LIMIT :start,:end ";
        paramsObj.timeFrom = timefrom;
        paramsObj.timeTo = timeto;
    }

    mysqlClient.query({
        sql: sql,
        params: paramsObj
    }, function(err, rows) {
        if (err) {
            debugProxy(err);
            return callback(new ServerError(), null);
        }

        callback(null, rows);
    });
};

/**
 * get fixed asset's count
 * @param {String} timefrom time from
 * @param {String} timeto time to
 * @param  {Function} callback the callback func
 * @return {null}
 */
exports.getFixedAssetCount = function(timefrom, timeto, callback) {
    debugProxy("proxy/fixedAsset/getFixedAssetCount");

    var sql = "";
    var paramsObj = {};

    if (timefrom.length === 0) {
        sql = "SELECT count(newId) AS 'count' FROM fixedAsset.ASSETS ";
    } else if (timefrom.length !== 0 && timeto.length !== 0) {
        sql = "SELECT count(newId) AS 'count' FROM fixedAsset.ASSETS " +
            " WHERE purchaseDate BETWEEN :timeFrom AND :timeTo ";
        paramsObj.timeFrom = timefrom;
        paramsObj.timeTo = timeto;
    }

    mysqlClient.query({
        sql: sql,
        params: paramsObj
    }, function(err, rows) {
        if (err) {
            debugProxy(err);
            return callback(new ServerError(), null);
        }

        if (rows && rows[0]) {
            return callback(null, rows[0].count);
        }

        return callback(new ServerError(), null);
    });
};

/**
 * get idel fixed asset list with dept id and typeId
 * @param  {string}   deptId    dept id
 * @param {int} typeId the fixed asset type id
 * @param  {int}   pageIndex the showing page index
 * @param  {Function} callback  the callback func
 * @return {null}
 */
exports.getIdelFAListByDeptIdAndTypeId = function(deptId, typeId, pageIndex, callback) {
    debugProxy("proxy/fixedAsset/getIdelFixedAssetsByDeptId");

    var baseParams = {
        departmentId: deptId,
        start: ((pageIndex - 1) * config.default_page_size),
        end: config.default_page_size
    };

    var sqlStr = "";

    if (typeId === 0) {
        sqlStr = "SELECT ast.*,astp.typeName FROM fixedAsset.ASSETS ast " +
            "LEFT JOIN ASSETTYPE astp " +
            "ON ast.typeId = astp.typeId " +
            " WHERE ast.departmentId = :departmentId " +
            " AND userId is null " +
            " LIMIT :start,:end ";
    } else {
        sqlStr = "SELECT ast.*,astp.typeName FROM fixedAsset.ASSETS ast " +
            "LEFT JOIN ASSETTYPE astp " +
            "ON ast.typeId = astp.typeId " +
            " WHERE ast.departmentId = :departmentId AND ast.typeId = :typeId " +
            " AND userId is null " +
            " LIMIT :start,:end ";
        baseParams.typeId = typeId;
    }

    mysqlClient.query({
        sql: sqlStr,
        params: baseParams
    }, function(err, rows) {
        if (err) {
            return callback(new ServerError(), null);
        }

        callback(null, rows);
    });
};

/**
 * get idel fixed asset count
 * @param  {string}   deptId   the department id
 * @param {int} typeId asset type id
 * @param  {Function} callback the callback func
 * @return {null}
 */
exports.getIdelFACountByDeptIdAndTypeId = function(deptId, typeId, callback) {
    debugProxy("proxy/fixedAsset/getIdelFACountByDeptIdAndTypeId");
    var baseParams = {
        departmentId: deptId
    };

    var sqlStr = "";

    if (typeId === 0) {
        sqlStr = "SELECT count(newId) AS 'count' FROM fixedAsset.ASSETS " +
            " WHERE departmentId = :departmentId AND userId IS null";
    } else {
        sqlStr = "SELECT count(newId) AS 'count' FROM fixedAsset.ASSETS " +
            " WHERE departmentId = :departmentId AND typeId = :typeId AND userId IS null";
        baseParams.typeId = typeId;
    }

    mysqlClient.query({
        sql: sqlStr,
        params: baseParams
    }, function(err, rows) {
        if (err) {
            return callback(new ServerError(), null);
        }

        if (rows && rows[0]) {
            return callback(null, rows[0].count);
        }

        return callback(new ServerError(), null);
    });
};

/**
 * update qrcode by newId (only one )
 * @param  {string}   newId    AssetNewId
 * @param  {Function} callback func
 * @return {null}
 */
exports.updateQrcode = function(newId, callback) {
    debugProxy("/proxy/fixedAsset/updateQrcode");
    var paramObj = {
        newId: newId,
    };
    if (newId) {
        QRCode.toDataURL(newId, function(err, url) {
            paramObj.qrcode = url;
            mysqlClient.query({
                sql: " UPDATE ASSETS SET qrcode=:qrcode " +
                    " WHERE newId=:newId",
                params: paramObj
            }, function(err, rows) {
                if (err || !rows) {
                    return callback(new ServerError(), null);
                }

                if (rows.affectedRows === 0) {
                    return callback(new ServerError(), null);
                }

                callback(null, paramObj.qrcode);
            });
        });
    }
};

/**
 * update allQrcode
 * @param  {Function} callback handle the qrcode about each row
 * @return {null}
 */
exports.updateAllQrcode = function(callback) {
    mysqlClient.query({
        sql: " SELECT NEWID FROM ASSETS"
    }, function(err, rows) {
        if (err || !rows) {
            return callback(new ServerError(), null);
        }

        if (rows.affectedRows === 0) {
            return callback(new ServerError(), null);
        }

        debugProxy(rows[0]);
    });
};

/**
 * import fixed assets to db
 * @param {String} companyId the company id
 * @param  {Array}   fixedAssets the array of fixed assets
 * @param  {Function} callback    the call back handler
 * @return {null}
 */
exports.importFixedAssets = function(companyId, fixedAssets, callback) {
    debugProxy("proxy/fixedAsset/importFixedAssets");

    var ep = EventProxy.create();
    ep.after("imported", fixedAssets.length, function() {
        callback();
    });

    for (var i = 0; i < fixedAssets.length; i++) {
        var item = fixedAssets[i];
        item.push(companyId);

        //check exists
        require("./fixedAsset").checkFixedAssetByfaID(item[4], function(err, hasFA) {
            if (err) {
                debugProxy(err);
            }

            if (hasFA) { //update
                updateSingleFixedAsset(item, function(err, rows) {
                    if (err) {
                        debugProxy(err);
                    }

                    ep.emit("imported");
                });
            } else { //insert
                insertSingleFixedAsset(item, function(err, rows) {
                    if (err) {
                        debugProxy(err);
                    }

                    ep.emit("imported");
                });
            }
        });
    }
};

/**
 * insert single fixed asset info
 * @param  {object}   fixedAssetInfo the instance of fixed asset
 * @param  {Function} callback       the callback handler
 * @return {null}
 */
function insertSingleFixedAsset(fixedAssetInfo, callback) {
    debugProxy("/proxy/fixedAsset/insertSingleFixedAsset");
    //if newId is empty
    if (fixedAssetInfo[4] === "") {
        return callback(null, null);
    }

    mysqlClient.query({
        sql: "INSERT INTO ASSETS(departmentId,userId,newId,oldId,assetName,typeId,assetBelong, " +
            "currentStatus,brand,model,specifications,price,purchaseDate,possessDate, " +
            "serviceCode,mac,remark1,remark2,companyId) " +
            "                   VALUES( :departmentId,  " +
            "                           :userId,        " +
            "                           :newId,         " +
            "                           :oldId,         " +
            "                           :assetName,     " +
            "                           :typeId,        " +
            "                           :assetBelong,   " +
            "                           :currentStatus, " +
            "                           :brand,         " +
            "                           :model,         " +
            "                           :specifications," +
            "                           :price,         " +
            "                           :purchaseDate,  " +
            "                           :possessDate,   " +
            "                           :serviceCode,   " +
            "                           :mac,           " +
            "                           :remark1,       " +
            "                           :remark2,       " +
            "                           :companyId);    ",
        params: {
            departmentId: fixedAssetInfo[1],
            userId: fixedAssetInfo[3],
            newId: fixedAssetInfo[4],
            oldId: fixedAssetInfo[5],
            assetName: fixedAssetInfo[6],
            typeId: fixedAssetInfo[7],
            assetBelong: fixedAssetInfo[8],
            currentStatus: fixedAssetInfo[9],
            brand: fixedAssetInfo[10],
            model: fixedAssetInfo[11],
            specifications: fixedAssetInfo[12],
            price: fixedAssetInfo[13],
            purchaseDate: fixedAssetInfo[14],
            possessDate: fixedAssetInfo[15],
            serviceCode: fixedAssetInfo[16],
            mac: fixedAssetInfo[17],
            remark1: fixedAssetInfo[18],
            remark2: fixedAssetInfo[19],
            companyId: fixedAssetInfo[20]
        }
    }, function(err, rows) {
        callback(err, rows);
    });
}

function updateSingleFixedAsset(fixedAssetInfo, callback) {
    debugProxy("/proxy/fixedAsset/updateSingleFixedAsset");
    //if newId is empty
    if (fixedAssetInfo[4] === "") {
        return callback(null, null);
    }

    mysqlClient.query({
        sql: "UPDATE ASSETS SET departmentId=:departmentId,userId=:userId," +
            "oldId=:oldId,assetName=:assetName,typeId=:typeId," +
            "assetBelong=:assetBelong,currentStatus=:currentStatus," +
            "brand=:brand,model=:model,specifications=:specifications,price=:price," +
            "purchaseDate=:purchaseDate,possessDate=:possessDate," +
            "serviceCode=:serviceCode,mac=:mac,remark1=:remark1,remark2=:remark2,companyId=:companyId " +
            " WHERE newId=:newId",
        params: {
            departmentId: fixedAssetInfo[1],
            userId: fixedAssetInfo[3],
            newId: fixedAssetInfo[4],
            oldId: fixedAssetInfo[5],
            assetName: fixedAssetInfo[6],
            typeId: fixedAssetInfo[7],
            assetBelong: fixedAssetInfo[8],
            currentStatus: fixedAssetInfo[9],
            brand: fixedAssetInfo[10],
            model: fixedAssetInfo[11],
            specifications: fixedAssetInfo[12],
            price: fixedAssetInfo[13],
            purchaseDate: fixedAssetInfo[14],
            possessDate: fixedAssetInfo[15],
            serviceCode: fixedAssetInfo[16],
            mac: fixedAssetInfo[17],
            remark1: fixedAssetInfo[18],
            remark2: fixedAssetInfo[19],
            companyId: fixedAssetInfo[20]
        }
    }, function(err, rows) {
        callback(err, rows);
    });
}

/**
 * get all data from database
 * @param  {Function} callback     the callback handler
 * @return {null}
 */
exports.getExportData = function(companyId, callback) {
    debugProxy("proxy/fixedAsset/getExportData");
    var paramObj = {
        companyId: companyId,
    };
    mysqlClient.query({
        sql: " SELECT a.*,ast.typeName,dep.departmentName,u.userName FROM ASSETS a " +
            " LEFT JOIN ASSETTYPE  ast ON a.typeId = ast.typeId " +
            " LEFT JOIN DEPARTMENT dep ON a.departmentId = dep.departmentId " +
            " LEFT JOIN USER u ON a.userId = u.userId " +
            " WHERE a.companyId = :companyId ;",
        params: paramObj
    }, function(err, rows) {
        if (err) {
            debugProxy(err);
            return callback(new ServerError(), null);
        }

        callback(null, rows);
    });
};

/**
 * get fixed asset conditions
 * @param  {Function} callback the call back func
 * @return {null}
 */
exports.getFixedAssetConditions = function(callback) {
    debugProxy("proxy/fixedAsset/getFixedAssetConditions");

    var ep = EventProxy();

    mysqlClient.query({
        sql: "SELECT distinct(currentStatus) FROM ASSETS;",
        params: {}
    }, function(err, rows) {
        if (err) {
            return ep.emitLater("error", new ServerError());
        }

        ep.emitLater("after_status", {
            status: rows
        });
    });

    ep.once("after_status", function(result) {
        mysqlClient.query({
            sql: "SELECT distinct(assetBelong) FROM ASSETS;",
            params: {}
        }, function(err, rows) {
            if (err) {
                return ep.emitLater("error", new ServerError());
            }

            result.belong = rows;
            ep.emitLater("completed", result);
        });
    });

    ep.once("completed", function(result) {
        callback(null, result);
    });

    ep.fail(function(err) {
        callback(err, null);
    });
};

/**
 * get fixed asset list with search conditions
 * @param  {Object}   conditions the condition object
 * @param  {Function} callback   the call back func
 * @return {null}
 */
exports.getFixedAssetListWithConditions = function(conditions, callback) {
    debugProxy("proxy/fixedAsset/getFixedAssetListWithConditions");
    conditions = conditions || {};

    var sql = "SELECT a.*, ast.typeName, u.userName, d.departmentName FROM ASSETS a " +
        "LEFT JOIN ASSETTYPE ast ON a.typeId = ast.typeId " +
        "LEFT JOIN DEPARTMENT d ON a.departmentId = d.departmentId " +
        "LEFT JOIN USER u ON a.userId = u.userId " +
        " WHERE 1 = 1 ";

    if (conditions.departmentId && conditions.departmentId.length !== 0) {
        sql += " AND a.departmentId = :departmentId ";
    }

    if (conditions.typeId && conditions.typeId.length !== 0) {
        sql += " AND a.typeId = :typeId ";
    }

    if (conditions.currentStatus && conditions.currentStatus.length !== 0) {
        sql += " AND a.currentStatus = :currentStatus ";
    }

    if (conditions.assetBelong && conditions.assetBelong.length !== 0) {
        sql += " AND a.assetBelong = :assetBelong ";
    }

    if (!conditions.page && conditions.page.length === 0) {
        conditions.page = 1;
    }

    conditions.start = ((conditions.page - 1) * config.default_page_size);
    conditions.end = config.default_page_size;

    sql += " ORDER BY a.userId LIMIT :start,:end  ;";

    debugProxy("sql:%s", sql);

    var ep = EventProxy.create();

    mysqlClient.query({
        sql: sql,
        params: conditions
    }, function(err, rows) {
        if (err) {
            return ep.emitLater("error", new ServerError());
        }

        ep.emitLater("after_list", {
            fixedAssets: rows
        });
    });

    ep.once("after_list", function(result) {
        getFixedAssetCountWithCondition(conditions, function(err, count) {
            if (err || !count) {
                return ep.emitLater("error", new ServerError());
            }

            result.total = count;
            ep.emitLater("completed", result);
        });
    });

    ep.once("completed", function(result) {
        callback(null, result);
    });

    ep.fail(function(err) {
        callback(err, null);
    });
};

/**
 * get fixed asset count with condition
 * @param  {Object}   conditions the condition of the sql
 * @param  {Function} callback   the call back func
 * @return {null}
 */
function getFixedAssetCountWithCondition(conditions, callback) {
    debugProxy("proxy/fixedAsset/getFixedAssetCountWithCondition");
    conditions = conditions || {};

    var sql = "SELECT count(*) totalCount FROM ASSETS a " +
        " WHERE 1 = 1 ";

    if (conditions.departmentId && conditions.departmentId.length !== 0) {
        sql += " AND a.departmentId = :departmentId ";
    }

    if (conditions.typeId && conditions.typeId.length !== 0) {
        sql += " AND a.typeId = :typeId ";
    }

    if (conditions.currentStatus && conditions.currentStatus.length !== 0) {
        sql += " AND a.currentStatus = :currentStatus ";
    }

    if (conditions.assetBelong && conditions.assetBelong.length !== 0) {
        sql += " AND a.assetBelong = :assetBelong ";
    }

    mysqlClient.query({
        sql: sql,
        params: conditions
    }, function(err, rows) {
        if (err || !rows) {
            return callback(new ServerError(), null);
        }

        callback(null, rows[0]);
    });
}

/**
 * get the userid by userName
 * @param  {string}   userName userName
 * @param  {Function} callback the callback function
 * @return {null}
 */
exports.getUserIdByUserName= function(userName, callback) {
    var ep = EventProxy.create();
    userName = '%'+userName+'%';
    var paramObj = {
        userName: userName,
    };
    mysqlClient.query({
        sql: "SELECT userId,department,userName FROM USER WHERE userName like :userName ;",
        params: paramObj
    }, function(err, rows) {
        if (err || !rows) {
            console.dir(err);
            return callback(new ServerError(), null);
        }
        callback(null, rows);
    })
}