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

var User        = require('../models/fixedAsset');
var mysqlClient = require("../libs/mysqlUtil");
var EventProxy  = require("eventproxy");
var config      = require("../config").initConfig();
                   require("../libs/DateUtil");
var QRCode      = require("qrcode");

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
exports.getFixedAssetByfaID = function (faId, callback) {
    console.log("######proxy/fixedAsset/getFixedAssetByfaID");

    faId = faId || "";

    if (faId.length === 0) {
        return callback(new InvalidParamError(), null);
    }

    var ep = EventProxy.create();

    mysqlClient.query({
        sql     : "SELECT * FROM ASSETS WHERE newId = :newId",
        params  : {
            "newId"  : faId
        }
    }, function (err, rows) {
        if (err) {
            return ep.emitLater("error", new ServerError());
        }

        var faInfo = {};
        if (rows && rows.length > 0) {
            var faDetail       = rows[0];
            faInfo["faDetail"] = faDetail;
            ep.emitLater("after_getFAInfo", faInfo);
        } else {
            return ep.emitLater("error", new DataNotFoundError());
        }
    });

    ep.once("after_getFAInfo", function (faInfo) {

        faInfo.faDetail.userId  = faInfo.faDetail.userId || "";

        if (faInfo.faDetail.userId.length != 0) {
            mysqlClient.query({
                sql     : "SELECT * FROM USER WHERE userId = :userId",
                params  : {
                    "userId"  : faInfo.faDetail.userId
                }
            }, function (err, rows) {
                if (err) {
                    return ep.emitLater("error", new ServerError());
                }

                var userInfo = {};
                if (rows && rows.length > 0) {
                    userInfo = rows[0];
                }

                faInfo["userInfo"] = userInfo;
                ep.emitLater("after_getUserInfo", faInfo);
            });
        } else {
            ep.emitLater("after_getUserInfo", faInfo);
        }
        
    });

    ep.once("after_getUserInfo", function (faInfo) {
        faInfo.faDetail.departmentId = faInfo.faDetail.departmentId || "";

        if (faInfo.faDetail.departmentId.length != 0) {
            mysqlClient.query({
                sql     : "SELECT * FROM DEPARTMENT WHERE departmentId = :departmentId",
                params  : {
                    "departmentId"  : faInfo.faDetail.departmentId
                }
            }, function (err, rows) {
                if (err) {
                    return ep.emitLater("error", new ServerError());
                }

                var deptInfo = {};
                if (rows && rows.length > 0) {
                    deptInfo           = rows[0];
                    faInfo["deptInfo"] = deptInfo;   
                }

                ep.emitLater("after_getDeptInfo", faInfo);
            });
        } else {
            ep.emitLater("after_getDeptInfo", faInfo);
        }
        
    });

    ep.once("after_getDeptInfo", function (faInfo) {
        faInfo.faDetail.typeId = faInfo.faDetail.typeId || "";

        if (faInfo.faDetail.typeId.length != 0) {
            mysqlClient.query({
                sql     : "SELECT * FROM ASSETTYPE WHERE typeId = :typeId",
                params  : {
                    "typeId"  : faInfo.faDetail.typeId
                }
            }, function (err, rows) {
                if (err) {
                    return ep.emitLater("error", new ServerError());
                }

                var typeInfo = {};
                if (rows && rows.length > 0) {
                    typeInfo           = rows[0];
                    faInfo["typeInfo"] = typeInfo;   
                }

                callback(null, faInfo);
            });
        } else {
            callback(null, faInfo);
        }
    });

    ep.fail(function (err) {
        return callback(err, null);
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

    mysqlClient.query({
        sql         : "INSERT INTO ASSETS VALUES(:newId,                    " +
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
exports.allocateFixedAsset = function (allocatingObj, callback) {
    console.log("######proxy/fixedAsset/allocateFixedAsset");

    allocatingObj["possessDate"] = new Date().Format("yyyy-MM-dd")

    mysqlClient.query({
        sql         : "UPDATE ASSETS SET userId=:userId, possessDate=:possessDate, " +
                      "                  departmentId=:departmentId" +
                      " WHERE newId=:newId",
        params      : allocatingObj
    }, function (err, rows) {
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
 * @param  {Function} callback the callback func
 * @return {null}            
 */
exports.getqrCodeByPageIndex = function (pageIndex, callback) {
    console.log("######proxy/fixedAsset/getAllqrCode");

    mysqlClient.query({
        sql         : "SELECT newId, t.typeName FROM fixedAsset.ASSETS a " +
                      "LEFT JOIN fixedAsset.ASSETTYPE t " +
                      "ON a.typeId = t.typeId " +
                      "ORDER BY purchaseDate DESC " +
                      "LIMIT :start,:end ",
        params      : {
            start : ((pageIndex - 1) * config.default_page_size),
            end   : config.default_page_size
        }
    }, function (err, rows) {
        if (err) {
            console.dir(err);
            return callback(new ServerError(), null);
        }

        callback(null, rows);
    });
};

/**
 * get fixed asset's count
 * @param  {Function} callback the callback func
 * @return {null}            
 */
exports.getFixedAssetCount = function (callback) {
    console.log("######proxy/fixedAsset/getFixedAssetCount");

    mysqlClient.query({
        sql         : "SELECT count(newId) AS 'count' FROM fixedAsset.ASSETS ",
        params      : {}
    }, function (err, rows) {
        if (err) {
            console.dir(err);
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
exports.getIdelFAListByDeptIdAndTypeId = function (deptId, typeId, pageIndex, callback) {
    console.log("######proxy/fixedAsset/getIdelFixedAssetsByDeptId");

    var baseParams = {
        departmentId  : deptId,
        start         : ((pageIndex - 1) * config.default_page_size),
        end           : config.default_page_size
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
        baseParams["typeId"] = typeId;
    }

    mysqlClient.query({
        sql       : sqlStr,
        params    : baseParams
    },  function (err, rows) {
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
exports.getIdelFACountByDeptIdAndTypeId = function (deptId, typeId, callback) {
    console.log("######proxy/fixedAsset/getIdelFACountByDeptIdAndTypeId");
    var baseParams = {
        departmentId  : deptId
    };

    var sqlStr = "";

    if (typeId === 0) {
        sqlStr = "SELECT count(newId) AS 'count' FROM fixedAsset.ASSETS " +
                    " WHERE departmentId = :departmentId AND userId IS null";
    } else {
        sqlStr = "SELECT count(newId) AS 'count' FROM fixedAsset.ASSETS " +
                    " WHERE departmentId = :departmentId AND typeId = :typeId AND userId IS null";
        baseParams["typeId"] = typeId;
    }

    mysqlClient.query({
        sql     : sqlStr,
        params  : baseParams
    },  function (err, rows) {
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
exports.updateQrcode = function (newId,callback) {
    var paramObj = {
        newId  : newId,
    };
    if (newId) {
        QRCode.toDataURL(newId,function (err, url) {
        paramObj["qrcode"]=url;
        mysqlClient.query({
            sql         : " UPDATE ASSETS SET qrcode=:qrcode "+
            " WHERE newId=:newId",
            params      : paramObj
        }, function (err, rows) { 
            if (err || !rows) {
                return callback(new ServerError(), null);
            }

            if (rows.affectedRows === 0) {
                return callback(new ServerError(), null);
            }

            callback(null,paramObj["qrcode"]);
            }); 
        });
    }      
}
/**
 * update allQrcode
 * @param  {Function} callback handle the qrcode about each row
 * @return {null}            
 */
exports.updateAllQrcode =  function (callback) {
    mysqlClient.query({
        sql  : " SELECT NEWID FROM ASSETS"
    },function (err,rows) {
        if (err || !rows) {
            return callback(new ServerError(), null);
        };
        if (rows.affectedRows === 0) {
            return callback(new ServerError(), null);
        };
        console.log(rows[0]);

    })
  }

/**
 * import fixed assets to db
 * @param  {Array}   fixedAssets the array of fixed assets
 * @param  {Function} callback    the call back handler
 * @return {null}               
 */
exports.importFixedAssets = function (fixedAssets, callback) {
    console.log("######proxy/fixedAsset/importFixedAssets");

    var ep = EventProxy.create();
    ep.after("inserted_data", fixedAssets.length, function () {
        callback();
    });

    for (var i = 0; i < fixedAssets.length; i++) {
        importSingleFixedAsset(fixedAssets[i], function (err, rows) {
            if (err) {
                console.log(err);
            }
            ep.emit("inserted_data");
        });
    }
};

/**
 * import single fixed asset info
 * @param  {object}   fixedAssetInfo the instance of fixed asset
 * @param  {Function} callback       the callback handler
 * @return {null}                  
 */
function importSingleFixedAsset (fixedAssetInfo, callback) {

    //if newId is empty
    if (fixedAssetInfo[4] === "") {
        return callback(null,null);
    }

    mysqlClient.query({
        sql     : "INSERT INTO ASSETS(departmentId,userId,newId,oldId,assetName,typeId,assetBelong, " +
                  "currentStatus,brand,model,specifications,price,purchaseDate,possessDate, " +
                  "serviceCode,mac,remark1,remark2) " +
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
                  "                           :remark2);      ",
        params  : {
            departmentId    : fixedAssetInfo[1],
            userId          : fixedAssetInfo[3],
            newId           : fixedAssetInfo[4],
            oldId           : fixedAssetInfo[5],
            assetName       : fixedAssetInfo[6],
            typeId          : fixedAssetInfo[7],
            assetBelong     : fixedAssetInfo[8],
            currentStatus   : fixedAssetInfo[9],
            brand           : fixedAssetInfo[10],
            model           : fixedAssetInfo[11],
            specifications  : fixedAssetInfo[12],
            price           : fixedAssetInfo[13],
            purchaseDate    : fixedAssetInfo[14],
            possessDate     : fixedAssetInfo[15],
            serviceCode     : fixedAssetInfo[16],
            mac             : fixedAssetInfo[17],
            remark1         : fixedAssetInfo[18],
            remark2         : fixedAssetInfo[19]
        }
    },  function (err, rows) {
        callback(err, rows);
    });
}

/**
 * get all data from database 
 * @param  {[type]}   pageIndex [description]
 * @param  {Function} callback  [description]
 * @return {[type]}             [description]
 */
exports.getExportData = function (callback) {
    console.log("######proxy/fixedAsset/getExportData");

    mysqlClient.query({
        sql         : " SELECT a.*,ast.typeName,dep.departmentName,u.userName FROM ASSETS a "+
                      " LEFT JOIN ASSETTYPE  ast On a.typeId = ast.typeId "+
                      " LEFT JOIN DEPARTMENT dep ON a.departmentId = dep.departmentId "+
                      " LEFT JOIN USER u ON a.userId = u.userId;"
    }, function (err, rows) {
        if (err) {
            console.dir(err);
            return callback(new ServerError(), null);
        }

        callback(null, rows);
    });
};

