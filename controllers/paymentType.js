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
  Date: Dec 23, 2013
  Time: 2:55 PM
  Desc: the controller of paymentType
 */

var EventProxy  = require("eventproxy");
var resUtil     = require("../libs/resUtil");
var config      = require("../config").initConfig();
var check       = require("validator").check;
var sanitize    = require("validator").sanitize;
var PaymentType = require("../proxy/paymentType");

/**
 * get all payment types
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.paymentTypes = function (req, res, next) {
    debugCtrller("/controllers/paymentType/paymentTypes");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    PaymentType.getAllPaymentType(function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(rows, config.statusCode.STATUS_OK));
    });
};

/**
 * insert a new payment type
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.insertion = function (req, res, next) {
    debugCtrller("/controllers/paymentType/insertion");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var ptInfo = {};

    try {
        check(req.body.ptName).notEmpty();
        ptInfo.ptName = sanitize(sanitize(req.body.ptName).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    PaymentType.add(ptInfo, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });
};

/**
 * modify a payment type
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}   
 */
exports.modification = function (req, res, next) {
    debugCtrller("/controllers/paymentType/modification");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var ptInfo = {};

    try {
        check(req.body.ptId).notEmpty();
        check(req.body.ptName).notEmpty();
        ptInfo.ptId   = sanitize(sanitize(req.body.ptId).trim()).xss();
        ptInfo.ptName = sanitize(sanitize(req.body.ptName).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    PaymentType.modify(ptInfo, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });
};