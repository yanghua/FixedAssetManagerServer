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
  Time: 6:14 PM
  Desc: the controller of gift
 */

var EventProxy = require("eventproxy");
var resUtil    = require("../libs/resUtil");
var config     = require("../config").initConfig();
var Gift       = require("../proxy/gift");
var check      = require("validator").check;
var sanitize   = require("validator").sanitize;

/**
 * get gifts by query condition
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.gifts = function (req, res, next) {
    debugCtrller("/controllers/gift/gifts");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var conditionObj = {};

    try {

        if (req.body.giftId) {
            check(req.body.giftId).notEmpty();
            req.body.giftId = sanitize(sanitize(req.body.giftId).trim()).xss();
            conditionObj.giftId = req.body.giftId;
        }

        if (req.body.categoryId) {
            check(req.body.categoryId).notEmpty();
            req.body.categoryId = sanitize(sanitize(req.body.categoryId)).xss();
            conditionObj.categoryId = req.body.categoryId;
        }

    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    Gift.getGiftWithConditiions(conditionObj, function (err, rows) {
       if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
       }

       res.send(resUtil.generateRes(rows, config.statusCode.STATUS_OK));
    });
};

/**
 * add a new gift
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.insertion = function (req, res, next) {
    debugCtrller("/controllers/gift/insertion");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var giftObj = {};
    try {
        check(req.body.name).notEmpty();
        check(req.body.categoryId).notEmpty();
        giftObj.name       = sanitize(sanitize(req.body.name).trim()).xss();
        giftObj.categoryId = sanitize(sanitize(req.body.categoryId).trim()).xss();
        giftObj.brand      = sanitize(sanitize(req.body.brand || "").trim()).xss();
        giftObj.unit       = sanitize(sanitize(req.body.unit || "").trim()).xss();
        giftObj.price      = sanitize(sanitize(req.body.price || "").trim()).xss();
        giftObj.expireDate = sanitize(sanitize(req.body.expireDate || "").trim()).xss();
        giftObj.categoryId = sanitize(sanitize(req.body.categoryId).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    Gift.add(giftObj, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });
};

/**
 * modify a gift
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.modification = function (req, res, next) {
    debugCtrller("/controllers/gift/modification");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var giftObj = {};
    try {
        check(req.body.giftId).notEmpty();
        check(req.body.name).notEmpty();
        check(req.body.categoryId).notEmpty();
        giftObj.giftId     = sanitize(sanitize(req.body.giftId).trim()).xss();
        giftObj.name       = sanitize(sanitize(req.body.name).trim()).xss();
        giftObj.categoryId = sanitize(sanitize(req.body.categoryId).trim()).xss();
        giftObj.brand      = sanitize(sanitize(req.body.brand || "").trim()).xss();
        giftObj.unit       = sanitize(sanitize(req.body.unit || "").trim()).xss();
        giftObj.price      = sanitize(sanitize(req.body.price || "").trim()).xss();
        giftObj.expireDate = sanitize(sanitize(req.body.expireDate || "").trim()).xss();
        giftObj.categoryId = sanitize(sanitize(req.body.categoryId).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    Gift.modify(giftObj, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });
};

/**
 * index page of gifts
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}   
 */
exports.gift = function (req, res, next) {
    debugCtrller("controllers/gift/index");
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    res.render('gift/subviews/index.html');
}

/**
 * manage page of gifts
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}   
 */
exports.giftManage = function(req, res, next) {
    debugCtrller("controllers/gift/manage");
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    res.render('gift/subviews/manage.html');
}

/**
 * storage page of gifts
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}   
 */
exports.storage = function(req, res, next) {
    debugCtrller("controllers/gift/storage");
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    res.render('gift/subviews/storage.html');
}

/**
 * other page of gifts
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}   
 */
exports.other = function(req, res, next) {
    debugCtrller("controllers/gift/other");
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    res.render('gift/subviews/other.html');
}

