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
  Desc: the controller of stock in
 */

var EventProxy = require("eventproxy");
var resUtil    = require("../libs/resUtil");
var config     = require("../config").initConfig();
var StockIn    = require("../proxy/stockIn");
var check      = require("validator").check;
var sanitize   = require("validator").sanitize;

/**
 * get stock in by conditions
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.stockins = function (req, res, next) {
    debugCtrller("/controllers/stockIn/stockins");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var conditions = {};

    try {
        if (req.body.giftId) {
            check(req.body.giftId).notEmpty();
            conditions.giftId = sanitize(sanitize(req.body.giftId).trim()).xss();
        }
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    StockIn.getAllStockInWithCondition(conditions, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(rows, config.statusCode.STATUS_OK));
    });
};

/**
 * add a new item
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}       
 */
exports.insertion = function (req, res, next) {
    debugCtrller("/controllers/stockIn/insertion");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var stockInInfo = {};

    try {
        check(req.body.giftId).notEmpty();
        check(req.body.num).notEmpty();
        check(req.body.amount).notEmpty();
        check(req.body.supplier).notEmpty();
        check(req.body.siTypeId).notEmpty();
        check(req.body.ptId).notEmpty();

        stockInInfo.giftId   = sanitize(sanitize(req.body.giftId).trim()).xss();
        stockInInfo.num      = sanitize(sanitize(req.body.num).trim()).xss();
        stockInInfo.amount   = sanitize(sanitize(req.body.amount).trim()).xss();
        stockInInfo.supplier = sanitize(sanitize(req.body.supplier).trim()).xss();
        stockInInfo.siTypeId = sanitize(sanitize(req.body.siTypeId).trim()).xss();
        stockInInfo.ptId     = sanitize(sanitize(req.body.ptId).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    StockIn.add(stockInInfo, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });

};

/**
 * modify a stock in item
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}   
 */
exports.modification = function (req, res, next) {
    debugCtrller("/controllers/stockIn/modification");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var stockInInfo = {};

    try {
        check(req.body.siId).notEmpty();
        check(req.body.giftId).notEmpty();
        check(req.body.num).notEmpty();
        check(req.body.amount).notEmpty();
        check(req.body.supplier).notEmpty();
        check(req.body.siTypeId).notEmpty();
        check(req.body.ptId).notEmpty();

        stockInInfo.siId     = sanitize(sanitize(req.body.siId).trim()).xss();
        stockInInfo.giftId   = sanitize(sanitize(req.body.giftId).trim()).xss();
        stockInInfo.num      = sanitize(sanitize(req.body.num).trim()).xss();
        stockInInfo.amount   = sanitize(sanitize(req.body.amount).trim()).xss();
        stockInInfo.supplier = sanitize(sanitize(req.body.supplier).trim()).xss();
        stockInInfo.siTypeId = sanitize(sanitize(req.body.siTypeId).trim()).xss();
        stockInInfo.ptId     = sanitize(sanitize(req.body.ptId).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    StockIn.modify(stockInInfo, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(generateRes(null, config.statusCode.STATUS_OK));
    });
};