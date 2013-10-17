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

var FixedAsset = require("../proxy/fixedAsset");
var resUtil    = require("../libs/resUtil");
var config     = require("../config").initConfig();
var check      = require("validator").check;
var sanitize   = require("validator").sanitize;
var EventProxy = require("eventproxy");

/**
 * get fixed asset by faId
 * @param  {object}   req  request
 * @param  {object}   res  response
 * @param  {Function} next next handler
 * @return {null}        
 */
exports.getFixedAssetByfaId = function (req, res, next){
    console.log("controllers/fixedAsset/getFixedAssetById");
    var faId=req.params.faId;

    FixedAsset.getFixedAssetByfaID(faId, function(err, rows) {
        if (err!=null) {
            console.log("controllers/getFixedAssetByfaId");
        }else{
            res.send(resUtil.generateRes(rows, config.statusCode.SATUS_OK));
        }
    });
}

/**
 * inspect fixed asset
 * @param  {object}   req  request
 * @param  {object}   res  response
 * @param  {Function} next next handler
 * @return {null}        
 */
exports.inspeck = function (req, res, next){
    console.log("controllers/fixedAsset/inspeck");

    var qrCode = req.body.qrCode;
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
            return ep.emitLater("error", "the fixedAsset not exists");
        }
    });

    ep.once("checkedFA", function (){
        FixedAsset.getFixedAssetByfaID(qrCode, function(err, rows){
            if (err) {
                return ep.emitLater("error", err);
            }else{
                console.log("emit  afterFADetail");
                faDetail = rows;
                ep.emit("afterFADetail",rows);
            }
        });
    });

    ep.once("afterFADetail", function(data) {
        //get user info
        userDetail = {"userId" : "123", "userName" : "yang hua"};
        ep.emit("afterUserDetail",null);
    });

    ep.once("afterUserDetail", function() {
        //generate res data
        var data ={};
        data["userDetail"] = userDetail;
        data["faDetail"]   = faDetail;
        console.dir(resUtil.generateRes(data, config.statusCode.SATUS_OK));
        res.send(resUtil.generateRes(data, config.statusCode.SATUS_OK));
    });

    ep.fail(function (err){
        console.log("*********enter fail handler");
        res.send(resUtil.generateRes(null, config.statusCode.STATUS_NOTFOUND));
    });

}

