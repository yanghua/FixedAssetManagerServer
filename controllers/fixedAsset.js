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
  Date: 11/10/13
  Time: 11:03 AM
  Desc: fixedAsset - the controller of fixedAsset
 */

//mode:
'use strict';

var FixedAsset  = require("../proxy/fixedAsset");
var User        = require("../proxy/user");
var resUtil     = require("../libs/resUtil");
var qrCodeUtil  = require("../libs/qrCodeUtil");
var config      = require("../config").initConfig();
var check       = require("validator").check;
var sanitize    = require("validator").sanitize;
var EventProxy  = require("eventproxy");
var exec        = require("child_process").exec;
var path        = require("path");
var fs          = require("fs");

/**
 * get fixed asset by faId
 * @param  {object}   req  request
 * @param  {object}   res  response
 * @param  {Function} next next handler
 * @return {null}
 */
exports.getFixedAssetByfaID = function (req, res, next) {
    console.log("******controllers/fixedAsset/getFixedAssetByfaId");
    var faId = req.params.faId || "";

    try {
        check(faId).notEmpty();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    faId = sanitize(sanitize(faId).trim()).xss();

    FixedAsset.getFixedAssetByfaID(faId, function (err, rows) {
        if (err) {
            res.send(resUtil.generateRes(null, err.statusCode));
        } else {
            res.send(resUtil.generateRes(rows, config.statusCode.SATUS_OK));
        }
    });
};

/**
 * inspect fixed asset
 * @param  {object}   req  request
 * @param  {object}   res  response
 * @param  {Function} next next handler
 * @return {null}
 */
exports.inspection = function (req, res, next) {
    console.log("******controllers/fixedAsset/inspection");
    var qrCode = req.body.qrCode || "";

    try {
        check(qrCode).notEmpty();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    qrCode = sanitize(sanitize(qrCode).trim()).xss();

    var ep = EventProxy.create();

    FixedAsset.checkFixedAssetByfaID(qrCode, function (err, hasFA) {
        if (err) {
            return ep.emitLater("error", err);
        }

        if (hasFA) {
            ep.emitLater("checkedFA");
        } else {
            return ep.emitLater("error", new DataNotFoundError());
        }
    });

    ep.once("checkedFA", function () {
        FixedAsset.getFixedAssetByfaID(qrCode, function (err, faInfo) {
            if (err) {
                return ep.emitLater("error", err);
            }

            res.send(resUtil.generateRes(faInfo, config.statusCode.SATUS_OK));
        });
    });

    //error handler
    ep.fail(function (err) {
        res.send(resUtil.generateRes(null, err.statusCode));
    });

};

/**
 * reject equipment
 * @param  {object}   req  the request object
 * @param  {object}   res  the response object
 * @param  {Function} next the next func
 * @return {null}        
 */
exports.rejection = function (req, res, next) {
    console.log("******controllers/fixedAsset/rejection");

    req.body.faId   = req.body.faId || "";
    req.body.reject = req.body.reject || 1;

    try {
        //check
        check(req.body.faId).notEmpty();
        check(req.body.reject).notEmpty();
        check(req.body.reject).isInt();

        //sanitize
        req.body.faId = sanitize(sanitize(req.body.faId).trim()).xss();
        req.body.faId = sanitize(req.body.reject).toInt();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    FixedAsset.rejectFixedAsset(req.body, function (err, rows) {
        if (err) {
            res.send(resUtil.generateRes(null, err.statusCode));
        } else {
            console.dir(rows);
            res.send(resUtil.generateRes(null, config.statusCode.SATUS_OK));
        }
    });
};


/**
 * fixed asset insertion
 * @param  {object}   req  the object of request
 * @param  {object}   res  the object of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.insertion = function (req, res, next) {
    console.log("******controllers/fixedAsset/insertion");

    var faObj = req.body;

    FixedAsset.addFixedAsset(faObj, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(null, config.statusCode.SATUS_OK));
    });

};


/**
 * the modification of fixed asset
 * @param  {object}   req  the request object
 * @param  {object}   res  the response object
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.modification = function (req, res, next) {
    console.log("******controllers/fixedAsset/modification");

    var faId = req.params.faId || "";

    try {
        check(faId).notEmpty();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    faId = sanitize(sanitize(faId).trim()).xss();

    var detailObj = req.body;

    FixedAsset.modifyFixedAsset(detailObj, faId, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(null, config.statusCode.SATUS_OK));
    });
};

/**
 * get fixed asset list by userId
 * @param  {object}   req  request object
 * @param  {object}   res  response object
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.getFixedAssetListByUserID = function (req, res, next) {
    console.log("******controllers/fixedAsset/getFixedAssetListByUserID");
    var userId = req.params.userId || "";

    try {
        check(userId).notEmpty();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    userId = sanitize(sanitize(userId).trim()).xss();

    FixedAsset.getFixedAssetListByUserID(userId, function (err, rows) {
        if (err) {
            console.log(err);
            return res.send(resUtil.generateRes(null, err.statusCode));
        } 
            
        res.send(resUtil.generateRes(rows, config.statusCode.SATUS_OK));
    });
};


/**
 * the allocation of fixed asset
 * @param  {object}   req  the object of request
 * @param  {object}   res  the object of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.allocation = function (req, res, next) {
    console.log("******controllers/fixedAsset/allocation");

    var faId   = req.body.faId || "";
    var userId = req.body.userId || "";

    try {
        check(faId).notEmpty();
        check(userId).notEmpty();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    faId   = sanitize(sanitize(faId).trim()).xss();
    userId = sanitize(sanitize(userId).trim()).xss();

    FixedAsset.allocateFixedAsset(faId, userId, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(rows, config.statusCode.SATUS_OK));
    });
};

/**
 * print service 
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.printService = function (req, res, next) {
    console.log("******controllers/fixedAsset/printService");

    FixedAsset.getAllqrCode(function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.render('subviews/print.html', {qrCodeList : rows});
    });
};
