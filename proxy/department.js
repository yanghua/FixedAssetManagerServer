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
  Date: 7/11/13
  Time: 17:25 PM
  Desc: departments - the controller of departments
 */

//mode:
'use strict';

var mysqlClient = require("../libs/mysqlUtil");

/**
 * get all department
 * @param  {Function} callback the callback func
 * @return {null}            
 */
exports.getAllDepartment = function (callback) {
    debugProxy("/proxy/department/getAllDepartment");
    mysqlClient.query({
        sql     : "SELECT * FROM DEPARTMENT",
        params  : {}
    }, function (err, rows) {
        if (err || !rows) {
            return callback(new ServerError(), null);
        }

        callback(null, rows);
    });
};