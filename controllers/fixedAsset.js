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
  Time: 11:03 AM
  Desc: fixedAsset - the controller of fixedAsset
 */

var FixedAsset        = require("../proxy/fixedAsset");
var User              = require("../proxy/user");
var resUtil           = require("../libs/resUtil");
var config            = require("../config").initConfig();
var check             = require("validator").check;
var sanitize          = require("validator").sanitize;
var EventProxy        = require("eventproxy");

/**
 * get fixed asset by faId
 * @param  {object}   req  request
 * @param  {object}   res  response
 * @param  {Function} next next handler
 * @return {null}        
 */
exports.getFixedAssetDetailByfaID = function (req, res, next){
    console.log("******controllers/fixedAsset/getFixedAssetDetailByfaId");
    var faId=req.params.faId;

    if (typeof(faId)=="undefined" || !check(faId).notEmpty()) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    };

    faId=sanitize(sanitize(faId).trim()).xss();

    FixedAsset.getFixedAssetDetailByfaID(faId, function(err, rows) {
        if (err) {
            res.send(resUtil.generateRes(null, err.statusCode));
        }else{
            res.send(resUtil.generateRes(rows, config.statusCode.SATUS_OK));
        }
    });
};

/**
 * get fixed asset by faId
 * @param  {object}   req  request
 * @param  {object}   res  response
 * @param  {Function} next next handler
 * @return {null}        
 */
exports.getFixedAssetByfaID = function (req, res, next){
    console.log("******controllers/fixedAsset/getFixedAssetByfaId");
    var faId=req.params.faId;

    if (typeof(faId)=="undefined" || !check(faId).notEmpty()) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    };

    faId=sanitize(sanitize(faId).trim()).xss();

    FixedAsset.getFixedAssetByfaID(faId, function(err, rows) {
        if (err) {
            res.send(resUtil.generateRes(null, err.statusCode));
        }else{
            res.send(resUtil.generateRes(rows, config.statusCode.SATUS_OK));
        }
    });
};

/**
 * inspect fixed asset
 * @param  {object}   req  request
 * @param  {object}   res  response
 * @param  {Function} next next handler
 * @return {null}        
 */
exports.inspection = function (req, res, next){
    console.log("******controllers/fixedAsset/inspection");

    var qrCode = req.body.qrCode;
    if (typeof(qrCode)=="undefined" || !check(qrCode).notEmpty()) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    qrCode=sanitize(sanitize(qrCode).trim()).xss();

    var ep = EventProxy.create();

    var userDetail = null;
    var faDetail   = null;

    FixedAsset.checkFixedAssetByfaID(qrCode, function (err, hasFA){
        if (err) {
            return ep.emitLater("error", err);
        }

        if (hasFA) {
            console.log("emit  checkedFA");
            ep.emitLater("checkedFA");
        }else{
            return ep.emitLater("error", new DataNotFoundError());
        }
    });

    ep.once("checkedFA", function (){
        FixedAsset.getFixedAssetByfaID(qrCode, function (err, rows){
            if (err) {
                return ep.emitLater("error", err);
            }else{
                console.log("emit  afterFAInfo");
                faDetail = rows;
                ep.emit("afterFAInfo",rows);
            }
        });
    });

    ep.once("afterFAInfo", function(faInfo) {

        if (!faInfo || typeof(faInfo.lastUserId) == "undefined" || 
                                  faInfo.lastUserId.length ===0 ) {
            return ep.emitLater("error", new ServerError());
        };
        
        User.getUserInfoById(faInfo.lastUserId, function (err, rows) {
            if (err) {
                return ep.emitLater("error", err);
            }else{
                ep.emitLater("afterUserDetail",rows);
            }
        });
    });

    ep.once("afterUserDetail", function (userInfo) {
        var data ={};
        data["userDetail"] = userInfo;
        data["faDetail"]   = faDetail;
        console.dir(resUtil.generateRes(data, config.statusCode.SATUS_OK));
        res.send(resUtil.generateRes(data, config.statusCode.SATUS_OK));
    });

    //error handler
    ep.fail(function (err){
        console.log("enter fail handler");
        res.send(resUtil.generateRes(null, err.statusCode));
    });

}


exports.rejection = function (req, res, next) {
    console.log("******controllers/fixedAsset/rejection");

    var faId = req.body.faId;
    var reject = req.body.reject;

    try {
        if (typeof(faId)=="undefined" || !check(faId).notEmpty()) {
            return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
        }

        if (typeof(reject)=="undefined" || !check(reject).notEmpty) {
            return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
        }

        //sanitize
        faId = sanitize(sanitize(faId).trim()).xss();
        if (!check(reject).isInt()) {
            reject = sanitize(reject).toInt();
        }

    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }
    
    FixedAsset.rejectFixedAsset({ equipmentId : faId, reject: reject }, function (err, rows) {
        if (err) {
            res.send(resUtil.generateRes(null, err.statusCode));
        }else{
            console.dir(rows);
            res.send(resUtil.generateRes(null, config.statusCode.SATUS_OK))
        }
    });
}


/**
 * get fixed asset list by userId
 * @param  {object}   req  request object
 * @param  {object}   res  response object
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.getFixedAssetListByUserID = function (req, res, next){
    console.log("******controllers/fixedAsset/getFixedAssetListByUserID");
    var userId = req.params.userId;

    if (typeof(userId)=="undefined" || !check(userId).notEmpty()) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    };

    userId=sanitize(sanitize(userId).trim()).xss();

    FixedAsset.getFixedAssetListByUserID(userId, function (err, rows){
        if (err) {
            console.log(err);
            res.send(resUtil.generateRes(null, err.statusCode));
        }else{
            res.send(resUtil.generateRes(rows, config.statusCode.SATUS_OK));
        }
    });

}

