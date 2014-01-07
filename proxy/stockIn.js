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
  Time: 11:18 AM
  Desc: the proxy of stock in
 */

var mysqlClient = require("../libs/mysqlUtil");
var util = require("../libs/util");

/**
 * get all stock in item list
 * @param  {Object} conditions the search conditions
 * @param  {Function} callback the callback func
 * @return {null}
 */
exports.getAllStockInWithCondition = function(conditions, callback) {
    debugProxy("/proxy/stockIn/getAllStockInWithCondition");
    var sql;

    sql = "SELECT si.*, g.name, sit.typeName, pt.ptName FROM STOCKIN si " +
        "LEFT JOIN GIFT g ON si.giftId = g.giftId                       " +
        "LEFT JOIN STOCKINTYPE sit ON si.siTypeId = sit.sitId           " +
        "LEFT JOIN PAYMENTTYPE pt ON si.ptId = pt.ptId                  " +
        "WHERE 1 = 1                                                    ";

    if (conditions) {
        if (conditions.giftId) {
            sql += " AND si.giftId = :giftId ";
        }

        if (conditions.siId) {
            sql += " AND si.siId = :siId ";
        }
    }

    mysqlClient.query({
        sql: sql,
        params: conditions
    }, function(err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, rows);
    });
};


/**
 * added a new stock in item
 * @param {stockInInfo}   stockInInfo a new instance of stock in
 * @param {Function} callback    the callback func
 */
exports.add = function(stockInInfo, callback) {
    debugProxy("/proxy/stockIn/add");

    var sql;

    sql = "INSERT INTO STOCKIN VALUES(:siId,            " +
          "                           :giftId,          " +
          "                           :num,             " +
          "                           :amount,          " +
          "                           :supplier,        " +
          "                           :siTypeId,        " +
          "                           :ptId,            " +
          "                           :siDate,          " +
          "                           :remark,          " +
          "                           :other            " +
          "                          );                 ";

    stockInInfo.siId = util.GUID();
    if (!stockInInfo.siDate) {
        stockInInfo.siDate = new Date().Format("yyyy-MM-dd");
    }

    mysqlClient.query({
        sql: sql,
        params: stockInInfo
    }, function(err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, null);
    });

};

/**
 * modify a stock in item
 * @param  {Object}   stockInInfo the instance of modifying stock in object
 * @param  {Function} callback    the callback func
 * @return {null}
 */
exports.modify = function(stockInInfo, callback) {
    debugProxy("/proxy/stockIn/modify");
    var sql;

    sql = "UPDATE STOCKIN SET                     " +
        "                   giftId = :giftId,     " +
        "                   num = :num,           " +
        "                   amount = :amount,     " +
        "                   supplier = :supplier, " +
        "                   siTypeId = :siTypeId, " +
        "                   ptId = :ptId,         " +
        "                   siDate = :siDate,     " +
        "                   remark = :remark,     " +
        "                   other = :other        " +
        "WHERE siId = :siId                       ";

    if (!stockInInfo.siDate) {
        stockInInfo.siDate = new Date().Format("yyyy-MM-dd");
    }

    mysqlClient.query({
        sql: sql,
        params: stockInInfo
    }, function(err, rows) {
        if (err || !rows) {
            return callback(new DBError(), null);
        }

        callback(null, null);
    });
};

/**
 * remove a stock in item
 * @param  {String}   siId     the stock in id
 * @param  {Function} callback the cb func
 * @return {null}
 */
exports.remove = function(siId, callback) {
    debugProxy("/proxy/stockIn/remove");

    var sql = "DELETE FROM STOCKIN WHERE siId = :siId";

    mysqlClient.query({
        sql: sql,
        params: {
            "siId": siId
        }
    }, function(err, rows) {
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
exports.removeWithGiftId = function(giftId, callback) {
    debugProxy("/proxy/stockIn/removeWithGiftId");

    var sql = "DELETE FROM STOCKIN WHERE giftId = :giftId";

    mysqlClient.query({
        sql: sql,
        params: {
            giftId: giftId
        }
    }, function(err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, null);
    });
};