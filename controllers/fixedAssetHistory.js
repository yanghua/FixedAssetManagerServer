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
  Desc: fixedAssetHistory - the controller of fixedAsset history
 */

var FixedAssetHistory = require("../proxy/fixedAssetHistory");
var resUtil           = require("../libs/resUtil");
var check             = require("validator").check;
var sanitize          = require("validator").sanitize;
var config            = require("../config").initConfig();
var EventProxy        = require("eventproxy");
var Login             = require("../proxy/login");
require("../libs/DateUtil");

/**
 * get fixed asset history
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.faHistory = function (req, res, next) {
    debugCtrller("controllers/fixedAssetHistory/faHistory");
    var faId = req.params.faId;

    try {
        check(faId).notEmpty();
        faId = sanitize(sanitize(faId).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    FixedAssetHistory.getHistoryListByFAId(faId, function(err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(rows, config.statusCode.STATUS_OK));
    });
};

/**
 * get operate reocord list forward a session section
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.operateRecordForwardASession = function (req, res, next) {
    debugCtrller("controllers/fixedAssetHistory/operateRecordForwardASession");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var ep = EventProxy.create();
    var timeQueryConditions = {};

    Login.getUserAuthInfoByUserId(req.session.user.userId, function (err, userInfo) {
        if (err) {
            return ep.emitLater("error", err);
        }

        if (!userInfo) {
            return ep.emitLater("error", err);
        }

        if (!userInfo.lastLoginTime) {
            var st = new Date();
            st.setMinutes(st - 30);                       //default use a session time section
            timeQueryConditions.startTime = st.Format("yyyy-MM-dd hh:mm:ss");
        } else {
            timeQueryConditions.startTime = new Date(userInfo.lastLoginTime).Format("yyyy-MM-dd hh:mm:ss");
        }

        debugCtrller("startTime is %s", timeQueryConditions.startTime);

        timeQueryConditions.endTime = new Date().Format("yyyy-MM-dd hh:mm:ss");

        ep.emitLater("after_getTimeCondition");
    });

    ep.once("after_getTimeCondition", function () {
        FixedAssetHistory.getOperateRecordsWithTimeSection(timeQueryConditions, function (err, rows) {
            if (err) {
                return ep.emitLater("error", err);
            }

            return res.send(resUtil.generateRes(rows, config.statusCode.STATUS_OK));
        });
    });

    ep.fail(function (err) {
        return res.send(resUtil.generateRes(null, err.statusCode));
    });
}