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

//mode
'use strict';

var FixedAssetHistory = require("../proxy/fixedAssetHistory");
var resUtil           = require("../libs/resUtil");
var check             = require("validator").check;
var sanitize          = require("validator").sanitize;
var config            = require("../config").initConfig();

/**
 * get fixed asset history
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.faHistory = function (req, res, next) {
    console.log("******controllers/fixedAssetHistory/faHistory");
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

        res.send(resUtil.generateRes(rows, config.statusCode.SATUS_OK));
    });
};