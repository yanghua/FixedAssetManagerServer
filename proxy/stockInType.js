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
  Date: Dec 19, 2013
  Time: 3:30 PM
  Desc: the proxy of stock in type
 */

var mysqlClient = require("../libs/mysqlUtil");
var util        = require("../libs/util");

/**
 * get all stock in type list
 * @param  {Function} callback the call back func
 * @return {null}        
 */
exports.getAllStockInTypes = function (callback) {
    debugProxy("/proxy/stockInType/getAllStockInTypes");

    mysqlClient.query({
        sql: "SELECT * FROM STOCKINTYPE",
        params: null
    }, function (err, rows) {
        if (err) {
            return callback(new DBError(), null);
        }

        callback(null, rows);
    });
};

/**
 * insert a new stock in type
 * @param {Object}   stockInType a new stockInType object
 * @param {Function} callback    the callback func
 */
exports.add = function (stockInType, callback) {
    debugProxy("/proxy/stockInType/add");
    var param        = stockInType || {};
    param.sitId = util.GUID();

    mysqlClient.query({
        sql     : "INSERT INTO STOCKINTYPE VALUES(:sitId, :typeName);",
        params  : param
    },  function (err, rows) {
        if (err || !rows || rows.affectedRows === 0) {
            debugProxy("error:" + err);
            return callback(new DBError(), null);
        }

        callback(null, rows);
    });
};

/**
 * modify a stock in type
 * @param  {Object}   stockInType the modifying stock in type
 * @param  {Function} callback    the callback func
 * @return {null}               
 */
exports.modify = function (stockInType, callback) {
    debugProxy("/proxy/stockInType/modify");

    var param        = stockInType || {};
    mysqlClient.query({
        sql     : "UPDATE STOCKINTYPE SET typeName = :typeName WHERE sitId = :sitId",
        params  : param
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy("error:" + err);
            return callback(new DBError(), null);
        }

        callback(null, rows);
    });
};
