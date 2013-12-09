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
  Date: Dec 5, 2013
  Time: 9:50 AM
  Desc: the controller of authUser
 */


//mode
'use strict';

var check    = require("validator").check;
var sanitize = require("validator").sanitize;
var AuthUser = require("../proxy/authUser");

/**
 * create a user
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.create = function (req, res, next) {
    debugCtrller("controllers/authUser/create");
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    try {
        check(req.body.uid).notEmpty();
        check(req.body.pwd).notEmpty();
        check(req.body.uName).notEmpty();
        req.body.uid = sanitize(sanitize(req.body.uid).trim()).xss();
        req.body.pwd = sanitize(sanitize(req.body.pwd).trim()).xss();
        req.body.uName = sanitize(sanitize(req.body.uName).trim()).xss();
    } catch (e) {
        res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    AuthUser.create(req.body, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });
};

/**
 * get all users
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.allUsers = function (req, res, next) {
    debugCtrller("controllers/authUser/allUsers");
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    AuthUser.getAllUsers(function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(rows, config.statusCode.STATUS_OK));
    });
};