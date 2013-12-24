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
  Date: Dec 12, 2013
  Time: 6:15 PM
  Desc: the proxy of gift
 */

var mysqlClient = require("../libs/mysqlUtil");
var util        = require("../libs/util");

/**
 * get gift with condition list
 * @param  {Object}   conditions the search conditions
 * @param  {Function} callback   the call back func
 * @return {null}              
 */
exports.getGiftWithConditiions = function (conditions, callback) {
    debugProxy("/proxy/gift/getGiftWithConditiions");
    var sql = "SELECT g.*, gc.name FROM GIFT g " +
              "LEFT JOIN GIFTCATEGORY gc ON g.categoryId = gc.categoryId " +
              "WHERE 1 = 1 ";

    if (conditions) {
        if (conditions.giftId) {
            sql += " AND giftId = :giftId ";
        }

        if (conditions.categoryId) {
            sql += " AND categoryId = :categoryId";
        }
    }

    mysqlClient.query({
        sql     : sql,
        params  : conditions
    },  function (err, rows) {
        if (err) {
            return callback(new DBError(), null);
        }

        callback(null, rows);
    });
};

/**
 * add a new gift
 * @param {Object}   giftInfo the inserting model of gift
 * @param {Function} callback the call back func
 */
exports.add = function (giftInfo, callback) {
    debugProxy("/proxy/gift/add");
    var param    = giftInfo || {};
    param.giftId = util.GUID();

    mysqlClient.query({
        sql       : "INSERT INTO GIFT(giftId, brand, name, unit, price, expireDate, categoryId) " +
                    " VALUES(:giftId, :brand, :name, :unit, :price, :expireDate, :categoryId);",
        params    : param
    },  function (err, rows) {
        if (err || !rows || rows.affectedRows === 0) {
            return callback(new DBError(), null);
        }

        callback(null, null);
    });
};

/**
 * edit a gift
 * @param  {Object}   giftInfo the updating gift model
 * @param  {Function} callback the call back func
 * @return {null}            
 */
exports.modify = function (giftInfo, callback) {
    debugProxy("/proxy/gift/modify");
    var param = giftInfo || {};

    mysqlClient.query({
        sql       : "UPDATE GIFT SET brand = :brand,            " +
                    "                name = :name,              " +
                    "                unit = :unit,              " +
                    "                price = :price,            " +
                    "                expireDate = :expireDate,  " +
                    "                categoryId = :categoryId   " +
                    " WHERE giftId = :giftId                    ",
        params    : param
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, null);
    });
};
