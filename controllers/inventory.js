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
  Time: 11:22 AM
  Desc: the controller of inventory
 */

var EventProxy  = require("eventproxy");
var resUtil     = require("../libs/resUtil");
var config      = require("../config").initConfig();
var check       = require("validator").check;
var sanitize    = require("validator").sanitize;
var Inventory   = require("../proxy/inventory");
var nodeExcel   = require('excel-export');
require("../libs/DateUtil");

/**
 * get inventories
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.inventories = function (req, res, next) {
    debugCtrller("/controllers/inventory/inventories");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var conditions = {};

    try {
        if (req.body.giftId) {
            conditions.giftId = sanitize(sanitize(req.body.giftId).trim()).xss();
        }
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    Inventory.getInventoryWithConditions(conditions, function (err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(rows, config.statusCode.STATUS_OK));
    });

};

/**
 * export stock in data with excel
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.exportInv = function(req, res, next) {
    debugCtrller("/controllers/stockIn/exportInv");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    var ep = EventProxy.create();

    //静态标题
    var conf = {};
    conf.cols = [{
        caption: '名称',
        type: 'string'
    }, {
        caption: '类别',
        type: 'string'
    }, {
        caption: '单位',
        type: 'string'
    }, {
        caption: '单价',
        type: 'string'
    }, {
        caption: '剩余库存',
        type: 'string'
    }, {
        caption: '过期日期',
        type: 'string'
    }];

    Inventory.getInventoryWithConditions( function(err, rows) {
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
                row.name,
                row.gcName,
                row.unit,
                row.price,
                row.num,
                dataHandler(row.expireDate)
            ]);
        }

        conf.rows = arrayObj;
        var result = nodeExcel.execute(conf);
        var fileTitle = "kucun_";
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename= " + fileTitle + (new Date().Format("yyyy-MM-dd")) + ".xlsx");
        res.end(result, 'binary');
    });
    function dataHandler (dataStr) {
      
        if (dataStr) {
            if ((dataStr+"").indexOf("0000") < 0 ) {
                return (new Date(dataStr)).Format("yyyy-MM-dd");
            }
            return "无";
        }else{
            return "无";
        }
    }
};

