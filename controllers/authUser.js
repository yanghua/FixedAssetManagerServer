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

var check      = require("validator").check;
var sanitize   = require("validator").sanitize;
var resUtil    = require("../libs/resUtil");
var AuthUser   = require("../proxy/authUser");
var SHA256     = require("crypto-js/sha256");
var SHA3       = require("crypto-js/sha3");
var EventProxy = require("eventproxy");
require("../libs/DateUtil");

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

    var newUser = {};

    try {
        check(req.body.uid).notEmpty();
        check(req.body.pwd).notEmpty();
        check(req.body.uName).notEmpty();
        newUser.uid   = sanitize(sanitize(req.body.uid).trim()).xss();
        newUser.pwd   = sanitize(sanitize(req.body.pwd).trim()).xss();
        newUser.uName = sanitize(sanitize(req.body.uName).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    var pwdInfo           = processPassword(newUser.uid, newUser.pwd);
    newUser.token         = pwdInfo.salt;
    newUser.pwd           = pwdInfo.encryptPwd;                       //override pwd field by encypting!!!
    newUser.lastLoginTime = new Date().Format("yyyy-MM-dd hh:mm:ss");

    AuthUser.create(newUser, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });
};

/**
 * modify password
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.modifyPassword = function (req, res, next) {
    debugCtrller("controllers/authUser/modifyPassword");
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var old_pwd = req.body.oldPwd;
    var new_pwd = req.body.newPwd;
    var userId  = req.session.user.userId;

    try {
        check(old_pwd).notEmpty();
        check(new_pwd).notEmpty();

        old_pwd = sanitize(sanitize(old_pwd).trim()).xss();
        new_pwd = sanitize(sanitize(new_pwd).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    var salt       = SHA256(userId).toString();
    var encryptPwd = SHA3(old_pwd + salt).toString();
    var ep         = EventProxy.create();

    Login.getUserAuthInfoByUserId(userId, function (err, userAuthInfo) {
        if (err || !userAuthInfo) {
            return ep.emitLater("error", err);
        }

        if (userAuthInfo.token === salt && userAuthInfo.pwd === encryptPwd) {
            return ep.emitLater("after_checkedOldPwd");
        } else {
            return ep.emitLater("error", new InvalidParamError());
        }
    });

    ep.once("after_checkedOldPwd", function () {
        var newEncryptPwd = SHA3(new_pwd + salt).toString();
        AuthUser.modifyPwd({ uid : userId, pwd : newEncryptPwd}, function (err, rows) {
            
        });
    });

    //error handler
    ep.fail(function (err) {
        return callback(err, null);
    });


}

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

        return res.send(resUtil.generateRes(rows, config.statusCode.STATUS_OK));
    });
};


/**
 * process password (add salt then encrypt)
 * @param  {String} uid  the user id
 * @param  {String} hashedPwd hashed password
 * @return {Object}           an object that packaged salt and encrypt pwd
 */
function processPassword (uid, hashedPwd) {
    if (!uid || !hashedPwd) {
        return null;
    }

    var salt       = SHA256(uid).toString();
    debugCtrller(salt);
    var encryptPwd = SHA3(hashedPwd + salt).toString();

    return {
        salt        : salt,
        encryptPwd  : encryptPwd
    };
}