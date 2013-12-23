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
  Desc: the controller of stock in type
 */

var resUtil      = require("../libs/resUtil");
var config       = require("../config").initConfig();
var check        = require("validator").check;
var sanitize     = require("validator").sanitize;
var StockInType  = require("../proxy/stockInType");

/**
 * get all stock in types
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.stockInTypes = function (req, res, next) {
    debugCtrller("/controllers/stockInType/stockInTypes");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    StockInType.getAllStockInTypes(function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(rows, config.statusCode.STATUS_OK)); 
    });
};

/**
 * the insertion of stock in type
 * @param {Object}   req  the instan ce of request
 * @param {Object}   res  the instance of response
 * @param {Function} next the next handler
 */
exports.insertion = function (req, res, next) {
    debugCtrller("/controllers/stockInType/insertion");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var typeName = req.body.typeName;

    try {
        check(typeName).notEmpty();
        typeName = sanitize(sanitize(typeName).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    StockInType.add({ typeName : typeName}, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK)); 
    });
};


/**
 * the modification of stock in type
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.modification = function (req, res, next) {
    debugCtrller("/controllers/stockInType/modification");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var sitId, typeName;

    sitId = req.body.sitId;
    typeName = req.body.typeName;

    try {
        check(sitId).notEmpty();
        check(typeName).notEmpty();
        sitId = sanitize(sanitize(sitId).trim()).xss();
        typeName = sanitize(sanitize(typeName).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    StockInType.modify({ sitId : sitId, typeName : typeName}, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });
};