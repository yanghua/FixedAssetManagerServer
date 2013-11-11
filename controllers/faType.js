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
  Desc: fixedAsset type - the controller of fixedAsset type
 */

//mode:
'use strict';

var FAType  = require("../proxy/faType");
var resUtil = require("../libs/resUtil");
var config  = require("../config").initConfig();


/**
 * get all fa types
 * @param  {object}   req  the request obj
 * @param  {object}   res  the response obj
 * @param  {Function} next the next func
 * @return {null}        
 */
exports.getAllFATypes = function (req, res, next) {
    FAType.getAllFATypes(function (err, faTypeList) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(faTypeList, config.statusCode.SATUS_OK));
    });
};