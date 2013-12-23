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
  Date: Dec 23, 2013
  Time: 2:56 PM
  Desc: the proxy of payment type
 */

var mysqlClient = require("../libs/mysqlUtil");
var util        = require("../libs/util");

/**
 * get all payment type list
 * @param  {Function} callback the callback func
 * @return {null}            
 */
exports.getAllPaymentType = function (callback) {
    debugProxy("/proxy/paymentType/getAllPaymentType");
    var sql;
    sql = "SELECT * FROM PAYMENTTYPE";

    mysqlClient.query({
        sql     : sql,
        params  : {}
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, rows);
    });
};

/**
 * add a payment type
 * @param {Object}   ptInfo   the instance of payment type
 * @param {Function} callback the callback func
 */
exports.add = function (ptInfo, callback) {
    debugProxy("/proxy/paymentType/add");
    var sql;
    ptInfo.ptId = util.GUID();
    sql = "INSERT INTO PAYMENTTYPE VALUES(:ptId, :ptName)";

    mysqlClient.query({
        sql     : sql,
        params  : ptInfo
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, null);
    });

};

/**
 * modify a payment type
 * @param  {Object}   ptInfo   the modifying payment type
 * @param  {Function} callback the callback func
 * @return {null}            
 */
exports.modify = function (ptInfo, callback) {
    debugProxy("/proxy/paymentType/modify");
    var sql;
    sql = "UPDATE PAYMENTTYPE SET ptName = :ptName WHERE ptId = :ptId";

    mysqlClient.query({
        sql   : sql,
        params: ptInfo
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, null);
    });
};