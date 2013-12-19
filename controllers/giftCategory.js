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
  Desc: the controller of gift category
 */

var GiftCategory = require("../proxy/giftCategory");
var resUtil      = require("../libs/resUtil");
var config       = require("../config").initConfig();
var check        = require("validator").check;
var sanitize     = require("validator").sanitize;

/**
 * get gift category list
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.giftCategories = function (req, res, next) {
    debugCtrller("/controllers/giftCategory/giftCategories");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    GiftCategory.getAllCategories(function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(rows, config.statusCode.STATUS_OK));
    });
};

/**
 * add a gift category
 * @param {Object}   req  the instan ce of request
 * @param {Object}   res  the instance of response
 * @param {Function} next the next handler
 */
exports.insertion = function (req, res, next) {
    debugCtrller("/controllers/giftCategory/insertion");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var name = req.body.name;

    try {
        check(name).notEmpty();
        name = sanitize(sanitize(name).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    GiftCategory.add({ name : name}, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });
};

/**
 * the modification of gift category
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.modification = function (req, res, next) {
    debugCtrller("/controllers/giftCategory/modification");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var categoryId, name;

    categoryId = req.body.categoryId;
    name = req.body.name;

    try {
        check(categoryId).notEmpty();
        check(name).notEmpty();
        categoryId = sanitize(sanitize(categoryId).trim()).xss();
        name = sanitize(sanitize(name).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    GiftCategory.modify({ categoryId : categoryId, name : name}, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });
};