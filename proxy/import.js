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
  Date: Dec 31, 2013
  Time: 10:37 AM
  Desc: the proxy of first importation for initlizing
 */

var mysqlClient = require("../libs/mysqlUtil");
var util        = require("../libs/util");
var EventProxy  = require("eventproxy");


/**
 * import stock in to tmp table
 * @param  {Array}   items    the array of importing items
 * @param  {Function} callback the callback func
 * @return {null}            
 */
exports.importTmpStockIn = function (items, callback) {
    debugProxy("/proxy/import/importTmpStockIn");

    var ep = EventProxy.create();
    ep.after("imported", items.length, function() {
        callback();
    });

    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        insertSingleTmpStockIn(item, function () {
            ep.emitLater("imported");
        });
    }
};

/**
 * do real import
 * @param  {Function} callback the cb func
 * @return {null}            
 */
exports.realImport = function (callback) {
    debugProxy("/proxy/import/realImport");

    mysqlClient.processTransaction(function (conn) {
        if (!conn) {
            return callback(new DBError(), null);
        }

        conn.beginTransaction(function (err) {
            if (err) {
                throw err;
            }

            var ep = EventProxy.create();

            insertGiftCategory(conn, function (err, rows) {
                if (err) {
                    return ep.emitLater("error", err);
                }

                ep.emitLater("after_insertGiftCategory");
            });

            ep.once("after_insertGiftCategory", function () {
                insertGift(conn, function (err, rows) {
                    if (err) {
                        return ep.emitLater("error", err);
                    }

                    ep.emitLater("after_insertGift");
                });
            });

            ep.once("after_insertGift", function () {
                insertPaymentType(conn, function (err, rows) {
                    if (err) {
                        return ep.emitLater("error", err);
                    }

                    ep.emitLater("after_insertPaymentType");
                });
            });

            ep.once("after_insertPaymentType", function () {
                insertStockIn(conn, function (err, rows) {
                    if (err) {
                        return ep.emitLater("error", err);
                    }
                });

                ep.emitLater("completed");
            });

            ep.once("completed", function () {
                conn.commit(function (err) {
                    if (err) {
                        conn.rollback(function () {
                            return ep.emitLater("error", new DBError());
                        });
                    }

                    callback(null, null);
                });
            });

            ep.fail(function (err) {
                callback(err, null);
            });

        });
    });
};


/**
 * insert gift category from TMP_STOCKIN
 * @param  {Object} conn the db connection
 * @param  {Function} callback the cb func
 * @return {null}            
 */
function insertGiftCategory (conn, callback) {
    debugProxy("/proxy/import/insertGiftCategory");

    var sql = "INSERT INTO GIFTCATEGORY SELECT UUID(),tsiCategory " +
              "FROM fixedAsset.TMP_STOCKIN GROUP BY tsiCategory;";

    conn.query(sql, null,  function (err, rows) {
        if (err) {
            debugProxy(err);
            conn.rollback(function () {
                return callback(new DBError(), null);
            });
        }

        callback(null, null);
    });
}

/**
 * insert gift info from import
 * @param  {Object} conn the db connection
 * @param  {Function} callback the cb func
 * @return {null}            
 */
function insertGift (conn, callback) {
    debugProxy("/proxy/import/insertGift");

    var sql = "INSERT INTO GIFT SELECT UUID(), tsiBrand, tsiName, tsiUnit, tsiPrice, '', t_gc.categoryId FROM ( " +
              "SELECT tsi.*, gc.categoryId FROM TMP_STOCKIN tsi " +
              "LEFT JOIN GIFTCATEGORY gc ON tsi.tsiCategory = gc.name " +
              "GROUP BY tsi.tsiName, tsi.tsiPrice " +
              ") t_gc";

    conn.query(sql, null, function (err, rows) {
        if (err) {
            debugProxy(err);
            conn.rollback(function () {
                return callback(new DBError(), null);
            });
        }

        callback(null, null);
    });
}

/**
 * insert payment type from import
 * @param  {Object} conn the db connection
 * @param  {Function} callback the cb func
 * @return {null}            
 */
function insertPaymentType (conn, callback) {
    debugProxy("/proxy/import/insertPaymentType");

    var sql = "INSERT INTO PAYMENTTYPE SELECT UUID(),tsiState " +
              "  FROM fixedAsset.TMP_STOCKIN GROUP BY tsiState;";

    conn.query(sql, null, function (err, rows) {
        if (err) {
            debugProxy(err);
            conn.rollback(function () {
                return callback(new DBError(), null);
            });
        }

        callback(null, null);
    });
}

/**
 * insert into stock in
 * @param  {Object} conn the db connection
 * @param  {Function} callback the cb func
 * @return {null}            
 */
function insertStockIn (conn, callback) {
    debugProxy("/proxy/import/insertStockIn");

    var sql = "INSERT INTO STOCKIN                                                                                  " +
              "SELECT  UUID(), t_g.giftId, tsiNum, tsiNum * tsiPrice, tsiSupplier, '', t_g.ptId, CURDATE(), '', ''  " +
              " FROM (                                                                                              " +
              "SELECT tsi.*, g.giftId, p.ptId FROM TMP_STOCKIN tsi                                                  " +
              " LEFT JOIN GIFT g ON tsi.tsiName = g.name AND tsi.tsiPrice = g.price                             " +
              " LEFT JOIN PAYMENTTYPE p ON tsi.tsiState = p.ptName                                                  " +
              ") t_g                                                                                                ";

    conn.query(sql, null, function (err, rows) {
        if (err) {
            debugProxy(err);
            conn.rollback(function () {
                return callback(new DBError(), null);
            });
        }

        callback(null, null);
    });
}

/**
 * insert single one tmp stock in
 * @param  {Object}   item     the instance of single one tsi
 * @param  {Function} callback the cb func
 * @return {null}            
 */
function insertSingleTmpStockIn (item, callback) {
    debugProxy("/proxy/import/insertSingleTmpStockIn");

    var sql = "INSERT INTO TMP_STOCKIN VALUES(                    " +
              "                               :tsiDate,           " +
              "                               :tsiCategory,       " +
              "                               :tsiBrand,          " +
              "                               :tsiName,           " +
              "                               :tsiUnit,           " +
              "                               :tsiNum,            " +
              "                               :tsiPrice,          " +
              "                               :tsiAmount,         " +
              "                               :tsiSupplier,       " +
              "                               :tsiState           " +
              "                              );                   ";

    mysqlClient.query({
        sql   : sql,
        params: {
            tsiDate     : item[0],
            tsiCategory : item[1],
            tsiBrand    : item[2],
            tsiName     : item[3],
            tsiUnit     : item[4],
            tsiNum      : item[5],
            tsiPrice    : item[6],
            tsiAmount   : item[7],
            tsiSupplier : item[8],
            tsiState    : item[9]
        }
    },  function (err, rows) {
        if (err) {
            debugProxy(err);
        }

        callback(err, rows);
    });
}