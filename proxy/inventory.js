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
  Time: 11:23 AM
  Desc: the proxy of inventory
 */

var mysqlClient = require("../libs/mysqlUtil");
var util        = require("../libs/util");

/**
 * get inventory with query conditions
 * @param  {Object}   conditions the instance of query conditions
 * @param  {Function} callback   the callback func
 * @return {null}              
 */
exports.getInventoryWithConditions = function (conditions, callback) {
    debugProxy("/proxy/inventory/getInventoryWithConditions");
    var sql;
    sql = "SELECT i.*, g.* FROM INVENTORY i " +
          "LEFT JOIN GIFT g ON i.giftId = g.giftId " +
          "WHERE 1 = 1 ";

    if (conditions) {
        if (conditions.giftId) {
            sql += "AND i.giftId = :giftId";
        }
    }

    mysqlClient.query({
        sql     : sql,
        params  : conditions
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, rows);
    });
};