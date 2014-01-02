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
  Date: Dec 16, 2013
  Time: 11:19 AM
  Desc: the proxy of stock out
 */

var mysqlClient = require("../libs/mysqlUtil");
var util        = require("../libs/util");

/**
 * get stock out list with conditions
 * @param  {Object}   conditions the search conditions
 * @param  {Function} callback   the callback func
 * @return {null}              
 */
exports.getStockOutWithCondition = function (conditions, callback) {
    debugProxy("/proxy/stockOut/getStockOutWithCondition");
    var sql;
    sql = "SELECT so.*, g.name, u.userName, d.departmentName, pt.ptName FROM STOCKOUT so " +
          "LEFT JOIN GIFT g ON so.giftId = g.giftId " +
          "LEFT JOIN USER u ON so.applyUserId = u.userId " +
          "LEFT JOIN DEPARTMENT d ON so.underDept = d.departmentId " +
          "LEFT JOIN PAYMENTTYPE pt ON so.ptId = pt.ptId " +
          "WHERE 1 = 1";

    if (conditions) {
        if (conditions.giftId) {
            sql += "AND so.giftId = :giftId";
        }
    }

    mysqlClient.query({
        sql   : sql,
        params: conditions
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, rows);
    });
};

/**
 * add a stock out info
 * @param {Object}   stockOutInfo the inserting stock out info
 * @param {Function} callback     the callback func
 * @return {null}  
 */
exports.add = function (stockOutInfo, callback) {
    debugProxy("/proxy/stockOut/add");
    var sql;

    stockOutInfo.soId = util.GUID();
    if (!stockOutInfo.siDate) {
        stockOutInfo.siDate = new Date().Format("yyyy-MM-dd");
    }

    sql = "INSERT INTO STOCKOUT VALUES(:soId, :giftId, :num, :amount, :applyUserId, :applyDeptId, :underDept, :ptId, :soDate);";

    mysqlClient.query({
        sql   : sql,
        params: stockOutInfo
    },  function (err, rows) {
        if (err || !rows) {
            return callback(new DBError(), null);
        }

        callback(null, null);
    });
};

/**
 * modify a stock out info
 * @param  {Object}   stockOutInfo the modifying stock out info
 * @param  {Function} callback     the callback func
 * @return {null}                
 */
exports.modify = function (stockOutInfo, callback) {
    debugProxy("/proxy/stockOut/modify");
    var sql;

    sql = "UPDATE STOCKOUT SET giftId = :giftId,            " +
          "                    num = :num,                  " +
          "                    amount = :amount,            " +
          "                    applyUserId = :applyUserId,  " +
          "                    applyDeptId = :applyDeptId,  " +
          "                    underDept = :underDept,      " +
          "                    ptId = :ptId,                " +
          "                    soDate = :soDate             " +
          "WHERE soId = :soId                               ";

    if (!stockOutInfo.siDate) {
        stockOutInfo.siDate = new Date().Format("yyyy-MM-dd");
    }

    mysqlClient.query({
        sql   : sql,
        params: stockOutInfo
    },  function (err, rows) {
        if (err || !rows) {
            return callback(new DBError(), null);
        }

        callback(null, null);
    });

};

/**
 * remove a stock out item
 * @param  {String}   soId     the stock out id
 * @param  {Function} callback the cb func
 * @return {null}            
 */
exports.remove = function (soId, callback) {
    debugProxy("/proxy/stockOut/remove");

    var sql = "DELETE FROM STOCKOUT WHERE soId = :soId";

    mysqlClient.query({
        sql   : sql,
        params: soId
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, null);
    });
};

/**
 * remove items with gift id
 * @param  {String}   giftId   the gift id
 * @param  {Function} callback the cb func
 * @return {null}            
 */
exports.removeWithGiftId = function (giftId, callback) {
    debugProxy("/proxy/stockOut/removeWithGiftId");

    var sql = "DELETE FROM STOCKOUT WHERE giftId = :giftId";

    mysqlClient.query({
        sql   : sql,
        params: { giftId : giftId }
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, null);
    });
};