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

/**
 * get all manual input departments (stockOut)
 * @param  {Function} callback the cb func
 * @return {null}            
 */
exports.getAllManualDept = function (callback) {
    debugProxy("/proxy/department/getAllManualDept");
    mysqlClient.query({
        sql     : "SELECT DISTINCT(underDept) FROM STOCKOUT;",
        params  : null
    },  function (err, rows) {
        if (err || !rows) {
            return callback(new DBEror(), null);
        }

        callback(null, processDeptStructure(rows));
    });
};

/**
 * inner func: process manual dept list
 * @param  {Array} deptList the department list
 * @return {Array}          the processed dept list
 */
function processDeptStructure (deptList) {
    var result = deptList.map(function (item) {
        return item.underDept; 
    });

    return result;
}