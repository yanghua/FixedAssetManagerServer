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
var nodeExcel = require('excel-export');

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
        check(req.body.underDept).notEmpty();
        check(req.body.ptId).notEmpty();

        stockOutInfo.giftId      = sanitize(sanitize(req.body.giftId).trim()).xss();
        stockOutInfo.num         = sanitize(sanitize(req.body.num).trim()).xss();
        stockOutInfo.amount      = sanitize(sanitize(req.body.amount).trim()).xss();
        stockOutInfo.applyUserId = sanitize(sanitize(req.body.applyUserId).trim()).xss();
        stockOutInfo.underDept   = sanitize(sanitize(req.body.underDept).trim()).xss();
        stockOutInfo.ptId        = sanitize(sanitize(req.body.ptId).trim()).xss();
        stockOutInfo.remark      = sanitize(sanitize(req.body.remark).trim()).xss();
        stockOutInfo.other       = sanitize(sanitize(req.body.other).trim()).xss();
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
        check(req.body.underDept).notEmpty();
        check(req.body.ptId).notEmpty();

        stockOutInfo.soId        = sanitize(sanitize(req.body.soId).trim()).xss();
        stockOutInfo.giftId      = sanitize(sanitize(req.body.giftId).trim()).xss();
        stockOutInfo.num         = sanitize(sanitize(req.body.num).trim()).xss();
        stockOutInfo.amount      = sanitize(sanitize(req.body.amount).trim()).xss();
        stockOutInfo.applyUserId = sanitize(sanitize(req.body.applyUserId).trim()).xss();
        stockOutInfo.underDept   = sanitize(sanitize(req.body.underDept).trim()).xss();
        stockOutInfo.ptId        = sanitize(sanitize(req.body.ptId).trim()).xss();
        stockOutInfo.remark      = sanitize(sanitize(req.body.remark).trim()).xss();
        stockOutInfo.other       = sanitize(sanitize(req.body.other).trim()).xss();
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

/**
 * export stockout excel
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null} 
 */
exports.exportSO = function(req, res, next) {
    debugCtrller("controllers/fixedAsset/exportExcel");
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    var ep = EventProxy.create();

    //静态标题
    var conf = {};
    conf.cols = [{
        caption: '出库日期',
        type: 'string'
    }, {
        caption: '申请人',
        type: 'string'
    }, {
        caption: '类别',
        type: 'string'
    }, {
        caption: '商品名称',
        type: 'string'
    }, {
        caption: '单位',
        type: 'string'
    }, {
        caption: '数量',
        type: 'string'
    }, {
        caption: '单价',
        type: 'string'
    }, {
        caption: '金额',
        type: 'string'
    }, {
        caption: '状态',
        type: 'string'
    }, {
        caption: '费用承担部门',
        type: 'string'
    }];

    StockOut.getStockOutWithCondition(function(err, rows) {
        if (err) {
            return ep.emitLater("error", err);
        }
        ep.emitLater("after_select", rows);
    });

    var arrayObj = [];
    ep.once("after_select", function(rows) {
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            arrayObj.push([
                dataHandler(row.soDate),
                row.userName,
                row.gcname,
                row.name,
                row.unit,
                row.num,
                row.price,
                row.amount,
                row.ptName,
                row.underDept
            ]);
        }

        conf.rows = arrayObj;
        var result = nodeExcel.execute(conf);
        var fileTitle = "stockOut_";
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename= " + fileTitle + (new Date().Format("yyyy-MM-dd")) + ".xlsx");
        res.end(result, 'binary');
    });
    function dataHandler (dataStr) {
        if (dataStr) {
            if ((dataStr+"").indexOf("0000") < 0) {
                return (new Date(dataStr)).Format("yyyy-MM-dd");
            }
            return "";
        }else{
            return "";
        }
    }
};