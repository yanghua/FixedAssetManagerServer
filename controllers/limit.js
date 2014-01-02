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
  Time: 11:24 AM
  Desc: the controller of limit
 */

var Limit    = require("../proxy/limit");
var resUtil  = require("../libs/resUtil");
var config   = require("../config").initConfig();
var check    = require("validator").check;
var sanitize = require("validator").sanitize;

/**
 * get all limit list
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.limitations = function (req, res, next) {
    debugCtrller("/controllers/limit/limitations");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    Limit.getAllLimits(function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(rows, err.statusCode));
        }

        res.send(resUtil.generateRes(rows, config.statusCode.STATUS_OK));
    });
};

/**
 * add a new limit for a gift
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}     
 */
exports.insertion = function (req, res, next) {
    debugCtrller("/controllers/limit/insertion");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var limitInfo = {};

    try {
        check(req.body.giftId).notEmpty();
        check(req.body.limitNum).notEmpty();

        limitInfo.giftId = sanitize(sanitize(req.body.giftId).trim()).xss();
        limitInfo.limitNum = sanitize(sanitize(req.body.limitNum).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    Limit.add(limitInfo, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });
};

/**
 * modify a limit info
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}    
 */
exports.modification = function (req, res, next) {
    debugCtrller("/controllers/limit/modification");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var limitInfo = {};

    try {
        check(req.body.giftId).notEmpty();
        check(req.body.limitNum).notEmpty();

        limitInfo.giftId = sanitize(sanitize(req.body.giftId).trim()).xss();
        limitInfo.limitNum = sanitize(sanitize(req.body.limitNum).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    Limit.modify(limitInfo, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });
};