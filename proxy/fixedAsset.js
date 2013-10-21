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

var User         = require('../models/fixedAsset');
var HostComputer = require("./hostComputer");
var mysqlUtil    = require("../libs/mysqlUtil"),
mysqlClient      = mysqlUtil.getMysqlClient();
var EventProxy   = require("eventproxy");
var config       = require("../config").initConfig();

/**
 * get fixed asset list by userId
 * @param  {string}   userId   user id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getFixedAssetListByUserID = function (userId, callback){
    console.log("######/proxy/fixedAsset/getFixedAssetListByUserId");

    if (typeof(userId) == "undefined" || userId.length ==0) {
        return callback("userId illegal", null);
    }

    mysqlClient.query({
        sql     : "SELECT * FROM fixedAsset.EQUIPMENT EQ "+
                  " WHERE lastUserId =:lastUserId",
        params  : {
            "lastUserId"  : userId
        }
    }, function (err, rows){
            callback(err, rows);
    });
};

/**
 * get fixed asset detail by faid
 * @param  {string}   faId     fixed asset id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getFixedAssetByfaID = function (faId, callback){
    console.log("######proxy/fixedAsset/getFixedAssetDetailByfaID");

    if (typeof(faId) == "undefined" || faId.length == 0) {
        return callback("userId illegal", null);
    }


    mysqlClient.query({
        sql     : "SELECT * FROM EQUIPMENT WHERE EQUIPMENTID = :EQUIPMENTID",
        params  : {
            "EQUIPMENTID"  : faId
        }
    }, function (err, rows){
            if (rows && rows.length>0) {
                var data=rows[0];
                callback(err, data);
            }else{
                callback(err, null);
            }
            
    });

}

/**
 * get fixed asset by faid
 * @param  {string}   faId     fixed asset id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.getFixedAssetDetailByfaID = function (faId, callback){
    console.log("######proxy/fixedAsset/getFixedAssetByfaID");

    if (typeof(faId) == "undefined" || faId.length == 0) {
        return callback("userId illegal", null);
    }

    var eq = EventProxy.create();

    mysqlClient.query({
        sql     : "SELECT * FROM EQUIPMENT WHERE EQUIPMENTID = :EQUIPMENTID",
        params  : {
            "EQUIPMENTID"  : faId
        }
    }, function (err, rows){
        if (err != null) {
            return ep.emitLater("error", err);
        }else{
            if (rows && rows.length>0) {
                eq.emitLater("afterFAType_proxy", rows[0]);
            }
        }
    });

    eq.once("afterFAType_proxy", function(faInfo){

        //split with equipment type
        if (faInfo.equipmentSqlName == config.faType.ENUM_HC) {
            require("./fixedAsset").getFixedAssetDetail(faInfo.equipmentId, config.faType.ENUM_HC, function(err, rows){
                if (err) {
                    return ep.emitLater("error", err);
                }else{
                    if (rows.length==0) {
                        return ep.emitLater("error", err);
                    }else{
                        faAll={};
                        faAll["faInfo"]=faInfo;
                        faAll["faDetail"]=rows[0];

                        eq.emitLater("afterFADetail_proxy", faAll);
                    }
                }
            });
        }
    });

    eq.once("afterFADetail_proxy", function(rows){
        console.log("afterFADetail_proxy");
        callback(null, rows);
    });

    //error handler
    eq.fail(function (err){
        callback(err, null);
    });

};


/**
 * check fixed asset by faId
 * @param  {string}   faId     fixed asset id
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.checkFixedAssetByfaID = function (faId, callback){
    console.log("######proxy/checkFixedAssetByfaID");

    if (typeof(faId) == "undefined" || faId.length == 0) {
        return callback("userId illegal", null);
    }

    mysqlClient.query({
        sql     : "SELECT COUNT(1) AS 'count' FROM EQUIPMENT WHERE EQUIPMENTID = :EQUIPMENTID",
        params  : {
            "EQUIPMENTID"  : faId
        }
    }, function (err, rows){
        if (err != null) {
            console.log("checkFixedAssetByfaID:"+err);
        }else{
            var hasFA;
            if (rows[0] && rows[0].count > 0) {
                hasFA = true;
            }else {
                hasFA = false;
            }
            callback(err, hasFA);
        }
    });
}

/**
 * modify fixed asset info 
 * @param  {object}   faObj    fixed asset object
 * @param  {Function} callback callback func
 * @return {null}            
 */
exports.modifyFixedAssetInfoBYfaID = function (faObj, callback){
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

/**
 * get fixed asset detail
 * @param  {string}   faId     the fixed asset id
 * @param  {string}   faType   the fixed asset type
 * @param  {Function} callback the callback func
 * @return {null}            
 */
exports.getFixedAssetDetail = function (faId, faType, callback) {
    console.log("##########proxy/fixedAsset/getFixedAssetDetail");
    mysqlClient.query({
        sql     : "SELECT * FROM "+ faType +" WHERE newId = :newId",
        params  : {
            "newId"  : faId
        }
    }, function (err, rows){          
        callback(err, rows);
    });
}

/**
 * modify fixed asset detail
 * @param  {object}   faObj    the fixed asset detail
 * @param  {Function} callback the callback func
 * @return {null}            
 */
exports.modifyFixedAssetDetail = function (faObj, callback) {
    console.log("##########proxy/fixedAsset/modifyFixedAssetDetail");
    mysqlClient.query({
        sql     : SQL_PATTERN_CONFIG[faObj.faType+"_MODIFY"],
        params  : faObj
    }, function (err, rows){          
        callback(err, rows);
    });
}




var SQL_PATTERN_CONFIG = {
    "HOSTCOMPUTER_MODIFY"       : "UPDATE HOSTCOMPUTER " + 
                                  " SET oldId=:oldId, brand=:brand, cpu=:cpu, "+
                                  "cpuFrequency=:cpuFrequency, ram=:ram, hd=:hd,"+
                                  " mac=:mac, price=:price, purpose=:purpose, "+
                                  "position=:position, remark=:remark "+
                                  " WHERE newId=:newId",

    "MOBILE_MODIFY"             : "UPDATE MOBILE " + 
                                  " SET deviceName=:deviceName, type=:type, "+
                                  "configure=:configure, price=:price, "+
                                  "purpose=:purpose, remark=:remark "+
                                  " WHERE newId=:newId",

    "MONITOR_MODIFY"            : "UPDATE MONITOR " + 
                                  " SET price=:price, position=:position, "+
                                  "supplier=:supplier, remark=:remark "+
                                  " WHERE newId=:newId",

    "NOTEBOOK_MODIFY"           : "UPDATE NOTEBOOK " + 
                                  " SET oldId=:oldId, type=:type, cpu=:cpu, "+
                                  "ram=:ram, hd=:hd, price=:price, purpose=:purpose, "+
                                  "serviceCode=:serviceCode, remark=:remark, "+
                                  "Mac1=:Mac1, Mac2=:Mac2 "+
                                  " WHERE newId=:newId",

    "OFFICEEQUIPMENT_MODIFY"    : "UPDATE OFFICEEQUIPMENT " + 
                                  " SET equipmentName=:equipmentName, price=:price, "+
                                  " purpose=:purpose, position=:position, "+
                                  " supplier=:supplier, remark=:remark "+
                                  " WHERE newId=:newId",

    "OFFICEFURNITURE_MODIFY"    : "UPDATE OFFICEFURNITURE " + 
                                  " SET furnitureName=:furnitureName, amount=:amount, "+
                                  " equipmentId=:equipmentId, equipmentName=:equipmentName, "+
                                  " lastUserId=:lastUserId, purchaseDate=:purchaseDate, "+
                                  " possessDate=:possessDate, reject=:reject, "+
                                  " rejectDate=:rejectDate "+
                                  " WHERE newId=:newId",

    "OTHEREQUIPMENT_MODIFY"     : "UPDATE OTHEREQUIPMENT " + 
                                  " SET equipmentName=:equipmentName, supplier=:supplier, "+
                                  " price=:price, remark=:remark "+
                                  " WHERE newId=:newId",

    "SERVER_MODIFY"             : "UPDATE SERVER " + 
                                  " SET purpose=:purpose, brand=:brand, cpu=:cpu, "+
                                  " cpuFrequency=:cpuFrequency, ram=:ram, "+
                                  " ramSize=:ramSize, ramFrequency=:ramFrequency, "+
                                  " hd=:hd, price=:price, position=:position, mac=:mac, "+
                                  " ipRange=:ipRange, remark=:remark "+
                                  " WHERE newId=:newId",

    "VIRTUALEQUIPMENT_MODIFY"   : "UPDATE VIRTUALEQUIPMENT " + 
                                  " SET equipmentName=:equipmentName, supplier=:supplier, price=:price, remark=:remark "+
                                  " WHERE newId=:newId",
};