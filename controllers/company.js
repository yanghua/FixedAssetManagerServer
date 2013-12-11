/*
  #!/usr/local/bin/node
  -*- coding:utf-8 -*-
 
  Copyright 2013 freedom Inc. All Rights Reserved.
 
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
  Date: Dec 11, 2013
  Time: 9:23 AM
  Desc: the controller of company
 */

var Company = require("../proxy/company");
var resUtil = require("../libs/resUtil");
var config  = require("../config").initConfig();

/**
 * get company list 
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.companies = function (req, res, next) {
    debugCtrller("controllers/company/companies");
    Company.getCompanyList(function (err, companyList) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        return res.send(resUtil.generateRes(companyList, config.statusCode.SATUS_OK));
    });
};