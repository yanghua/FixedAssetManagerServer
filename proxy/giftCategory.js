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
  Time: 11:16 AM
  Desc: the proxy of gift category
 */

var mysqlClient = require("../libs/mysqlUtil");
var util        = require("../libs/util");

/**
 * get all gift category list
 * @param  {Function} callback the callback func
 * @return {null}            
 */
exports.getAllCategories = function (callback) {
    debugProxy("/proxy/giftCategory/getAllCategories");
    mysqlClient.query({
        sql: "SELECT * FROM GIFTCATEGORY",
        params: null
    }, function (err, rows) {
        if (err) {
            return callback(new DBError(), null);
        }

        callback(null, rows);
    });
};

/**
 * insert a category
 * @param {Object}   categoryInfo the inserting category info
 * @param {Function} callback     the callback func
 * @return {null}                
 */
exports.add = function (categoryInfo, callback) {
    debugProxy("/proxy/giftCategory/add");
    var param        = categoryInfo || {};
    param.categoryId = util.GUID();

    mysqlClient.query({
        sql       : "INSERT INTO GIFTCATEGORY VALUES(:categoryId, :name);",
        params    : categoryInfo
    },  function (err, rows) {
        if (err || !rows || rows.affectedRows === 0) {
            return callback(new DBError(), null);
        }

        callback(null, null);
    });
};

/**
 * change a category
 * @param  {Object}   categoryInfo the editing category info
 * @param  {Function} callback     the callback func
 * @return {null}                
 */
exports.modify = function (categoryInfo, callback) {
    debugProxy("/proxy/giftCategory/modify");
    var param        = categoryInfo || {};

    mysqlClient.query({
        sql       : "UPDATE GIFTCATEGORY SET name = :name WHERE categoryId = :categoryId",
        params    : param
    },  function (err, rows) {
        if (err || !rows) {
            debugProxy(err);
            return callback(new DBError(), null);
        }

        callback(null, null);
    });
};