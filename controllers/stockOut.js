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
  Desc: the controller of stock out
 */

var EventProxy = require("eventproxy");
var resUtil    = require("../libs/resUtil");
var config     = require("../config").initConfig();
var StockOut   = require("../proxy/stockOut");
var check      = require("validator").check;
var sanitize   = require("validator").sanitize;

/**
 * get all stockout items
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.stockouts = function (req, res, next) {
    debugCtrller("/controllers/stockOut/stockouts");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var conditions = {};

    try {
        if (req.body.giftId) {
            check(req.body.giftId).notEmpty();
            conditions.giftId = sanitize(sanitize(req.body.giftId).trim()).xss();
        }

        if (req.body.soId) {
            check(req.body.soId).notEmpty();
            conditions.soId = sanitize(sanitize(req.body.soId).trim()).xss();
        }
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    StockOut.getStockOutWithCondition(conditions, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(rows, config.statusCode.STATUS_OK));
    });
};

/**
 * add a new stock out item
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}  
 */
exports.insertion = function (req, res, next) {
    debugCtrller("/controllers/stockOut/insertion");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var stockOutInfo = {};

    try {
        check(req.body.giftId).notEmpty();
        check(req.body.num).notEmpty();
        check(req.body.amount).notEmpty();
        check(req.body.applyUserId).notEmpty();
        check(req.body.applyDeptId).notEmpty();
        check(req.body.underDept).notEmpty();
        check(req.body.ptId).notEmpty();

        stockOutInfo.giftId      = sanitize(sanitize(req.body.giftId).trim()).xss();
        stockOutInfo.num         = sanitize(sanitize(req.body.num).trim()).xss();
        stockOutInfo.amount      = sanitize(sanitize(req.body.amount).trim()).xss();
        stockOutInfo.applyUserId = sanitize(sanitize(req.body.applyUserId).trim()).xss();
        stockOutInfo.applyDeptId = sanitize(sanitize(req.body.applyDeptId).trim()).xss();
        stockOutInfo.underDept   = sanitize(sanitize(req.body.underDept).trim()).xss();
        stockOutInfo.ptId        = sanitize(sanitize(req.body.ptId).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    StockOut.add(stockOutInfo, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });
};

/**
 * modify a stock out item
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}  
 */
exports.modification = function (req, res, next) {
    debugCtrller("/controllers/stockOut/modification");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var stockOutInfo = {};

    try {
        check(req.body.soId).notEmpty();
        check(req.body.giftId).notEmpty();
        check(req.body.num).notEmpty();
        check(req.body.amount).notEmpty();
        check(req.body.applyUserId).notEmpty();
        check(req.body.applyDeptId).notEmpty();
        check(req.body.underDept).notEmpty();
        check(req.body.ptId).notEmpty();

        stockOutInfo.soId        = sanitize(sanitize(req.body.soId).trim()).xss();
        stockOutInfo.giftId      = sanitize(sanitize(req.body.giftId).trim()).xss();
        stockOutInfo.num         = sanitize(sanitize(req.body.num).trim()).xss();
        stockOutInfo.amount      = sanitize(sanitize(req.body.amount).trim()).xss();
        stockOutInfo.applyUserId = sanitize(sanitize(req.body.applyUserId).trim()).xss();
        stockOutInfo.applyDeptId = sanitize(sanitize(req.body.applyDeptId).trim()).xss();
        stockOutInfo.underDept   = sanitize(sanitize(req.body.underDept).trim()).xss();
        stockOutInfo.ptId        = sanitize(sanitize(req.body.ptId).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    StockOut.modify(stockOutInfo, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });
};

/**
 * delete a stock in item
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.deletion = function (req, res, next) {
    debugCtrller("/controllers/stockOut/deletion");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var soId;

    try {
        check(req.body.soId).notEmpty();
        soId = req.body.soId;
        soId = sanitize(sanitize(soId).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    StockOut.remove(soId, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });
};