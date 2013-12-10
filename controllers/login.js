/*
  #!/usr/local/bin/node
  -*- coding:utf-8 -*-
 
  Copyright 2013 yanghua Inc. All Rights Reserved.
 
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
  User: yanghua
  Date: 7/11/13
  Time: 17:03 PM
  Desc: login - the controller of login
 */

//mode:
'use strict';

var Login      = require("../proxy/login");
var captchagen = require('captchagen');
var check      = require("validator").check;
var sanitize   = require("validator").sanitize;
var SHA256     = require("crypto-js/sha256");

/**
 * show login page
 * @param  {object}   req  the request object
 * @param  {object}   res  the response object
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.showLogin = function (req, res, next) {
    debugCtrller("controllers/login/showLogin");
    res.render("login");
};

/**
 * handler sign in
 * @param  {object}   req  the request object
 * @param  {object}   res  the response object
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.signIn = function (req, res, next) {
    debugCtrller("controllers/login/signIn");
    var captchaCode = req.body.auth.captchaCode || "";
    var userId      = req.body.auth.userId || "";
    var passwd      = req.body.auth.passwd || "";

    try {
        check(captchaCode).notEmpty();
        check(userId).notEmpty();
        check(passwd).notEmpty();
        captchaCode = sanitize(sanitize(captchaCode).trim()).xss();
        userId      = sanitize(sanitize(userId).trim()).xss();
        passwd      = sanitize(sanitize(passwd).trim()).xss();
    } catch (e) {
        return res.send("5");
    }

    if (!req.session || !req.session.captchaCode || 
       captchaCode != req.session.captchaCode) {
        return res.send("4");
    }

    Login.getUserAuthInfoByUserId(userId, function (err, userAuthInfo) {
        if (err) {
            return res.send("3");
        }

        if (!userAuthInfo) {
            return res.send("2");
        }

        //check
        if (userId === userAuthInfo["uid"] && passwd === userAuthInfo["pwd"]) {
            var user         = {};
            user["userId"]   = userId;
            user["uName"]    = userAuthInfo["uName"]; 
            req.session.user = user;

            return res.send("1");
        } else {
            return res.send("0");
        }
    });

};

/**
 * common process
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.commonProcess = function (req, res, next) {
    debugCtrller("controllers/login/commonProcess");
    var param = req.query.api || 0;
    var isAPI = parseInt(param);

    if (isAPI === 1) {                //is mobile api
        return next();
    } else if (req.path == "/login") {
        return next();
    } else {
        if (req.session && req.session.user) {
            res.local("current_user", req.session.user);
        }

        next();
    }
};

/**
 * generate captcha image
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.captchaImg = function (req, res, next) {
    debugCtrller("controllers/login/captchaImg");
    var captcha     = captchagen.create();
    var captchaCode = captcha.text();
        
    if (captchaCode) {
        req.session.captchaCode = captchaCode;
    }

    //generate
    captcha.generate();

    res.send(captcha.buffer());
};
