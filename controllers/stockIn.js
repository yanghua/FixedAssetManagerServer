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
  Time: 11:18 AM
  Desc: the controller of stock in
 */

var EventProxy = require("eventproxy");
var resUtil = require("../libs/resUtil");
var config = require("../config").initConfig();
var StockIn = require("../proxy/stockIn");
var Import = require("../proxy/import");
var check = require("validator").check;
var sanitize = require("validator").sanitize;
var parseXlsx = require("excel");
var Inventory = require("../proxy/inventory");
var path = require("path");
var fs = require("fs");
var parseXlsx = require("excel");
var nodeExcel = require('excel-export');

/**
 * get stock in by conditions
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.stockins = function(req, res, next) {
    debugCtrller("/controllers/stockIn/stockins");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var conditions = {};

    try {
        if (req.body.giftId) {
            check(req.body.giftId).notEmpty();
            conditions.giftId = sanitize(sanitize(req.body.giftId).trim()).xss();
        }

        if (req.body.siId) {
            check(req.body.siId).notEmpty();
            conditions.siId = sanitize(sanitize(req.body.siId).trim()).xss();
        }
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    StockIn.getAllStockInWithCondition(conditions, function(err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(rows, config.statusCode.STATUS_OK));
    });
};

/**
 * add a new item
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.insertion = function(req, res, next) {
    debugCtrller("/controllers/stockIn/insertion");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var stockInInfo = {};

    try {
        check(req.body.giftId).notEmpty();
        check(req.body.num).notEmpty();
        check(req.body.amount).notEmpty();
        check(req.body.supplier).notEmpty();
        check(req.body.siTypeId).notEmpty();
        check(req.body.ptId).notEmpty();

        stockInInfo.giftId = sanitize(sanitize(req.body.giftId).trim()).xss();
        stockInInfo.num = sanitize(sanitize(req.body.num).trim()).xss();
        stockInInfo.amount = sanitize(sanitize(req.body.amount).trim()).xss();
        stockInInfo.supplier = sanitize(sanitize(req.body.supplier).trim()).xss();
        stockInInfo.siTypeId = sanitize(sanitize(req.body.siTypeId).trim()).xss();
        stockInInfo.ptId = sanitize(sanitize(req.body.ptId).trim()).xss();
        stockInInfo.remark = sanitize(sanitize(req.body.remark).trim()).xss();
        stockInInfo.other = sanitize(sanitize(req.body.other).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    StockIn.add(stockInInfo, function(err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });

};

/**
 * modify a stock in item
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.modification = function(req, res, next) {
    debugCtrller("/controllers/stockIn/modification");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var stockInInfo = {};

    try {
        check(req.body.siId).notEmpty();
        check(req.body.giftId).notEmpty();
        check(req.body.num).notEmpty();
        check(req.body.amount).notEmpty();
        check(req.body.supplier).notEmpty();
        check(req.body.siTypeId).notEmpty();
        check(req.body.ptId).notEmpty();

        stockInInfo.siId = sanitize(sanitize(req.body.siId).trim()).xss();
        stockInInfo.giftId = sanitize(sanitize(req.body.giftId).trim()).xss();
        stockInInfo.num = sanitize(sanitize(req.body.num).trim()).xss();
        stockInInfo.amount = sanitize(sanitize(req.body.amount).trim()).xss();
        stockInInfo.supplier = sanitize(sanitize(req.body.supplier).trim()).xss();
        stockInInfo.siTypeId = sanitize(sanitize(req.body.siTypeId).trim()).xss();
        stockInInfo.ptId = sanitize(sanitize(req.body.ptId).trim()).xss();
        stockInInfo.remark = sanitize(sanitize(req.body.remark).trim()).xss();
        stockInInfo.other = sanitize(sanitize(req.body.other).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    StockIn.modify(stockInInfo, function(err, rows) {
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
exports.deletion = function(req, res, next) {
    debugCtrller("/controllers/stockIn/deletion");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var siId;

    try {
        check(req.body.siId).notEmpty();
        siId = req.body.siId;
        siId = sanitize(sanitize(siId).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    var ep = new EventProxy();

    StockIn.remove(siId, function(err, rows) {
        if (err) {
            return ep.emitLater("error", err);
        }

        ep.emitLater("after_removedstockin");
    });

    ep.once("after_removedstockin", function() {
        Inventory.removeUselessItem(function(err, rows) {
            if (err) {
                return ep.emitLater("error", err);
            }

            ep.emitLater("completed");
        });
    });

    ep.once("completed", function() {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });

    ep.fail(function(err) {
        return res.send(resUtil.generateRes(null, err.statusCode));
    });
};

/**
 * get all suppliers
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.suppliers = function(req, res, next) {
    debugCtrller("/controllers/stockIn/suppliers");

    StockIn.getAllSuppliers(function(err, rows) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(rows, config.statusCode.STATUS_OK));
    });
};

/**
 * import stock in data
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.importSI = function(req, res, next) {
    debugCtrller("/controllers/stockIn/importSI");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var fileName = req.files.file_source.name || "";
    var tmp_path = req.files.file_source.path || "";

    try {
        check(fileName).notEmpty();
        check(tmp_path).notEmpty();
        fileName = sanitize(sanitize(fileName).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    var xlsxPath = path.resolve(__dirname, "../uploads/", fileName);
    var ep = EventProxy.create();

    fs.rename(tmp_path, xlsxPath, function(err) {
        if (err) {
            return ep.emitLater("error", new ServerError());
        }

        ep.emitLater("renamed_file");
    });

    ep.once("renamed_file", function() {
        ep.emitLater("after_deletedTmpFile");
    });

    ep.once("after_deletedTmpFile", function() {
        parseXlsx(xlsxPath, function(err, data) {
            if (err || !data) {
                return ep.emitLater("error", new ServerError());
            }

            return ep.emitLater("after_parsedExcelData", data);
        });
    });

    ep.once("after_parsedExcelData", function(excelData) {
        debugCtrller(excelData[0].length);
        if (excelData[0].length != 10) {
            return ep.emitLater("error", new InvalidParamError());
        }

        //remove first title array
        excelData.shift();

        Import.importTmpStockIn(excelData, function(err, rows) {
            fs.unlinkSync(xlsxPath);
            ep.emitLater("after_importedIntoTmpTable");
        });
    });

    ep.once("after_importedIntoTmpTable", function() {
        Import.realImport(function(err, rows) {
            if (err) {
                return ep.emitLater("error", err);
            }

            ep.emitLater("completed");
        });
    });

    ep.once("completed", function() {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });

    ep.fail(function(err) {
        fs.unlinkSync(xlsxPath);
        return res.send(resUtil.generateRes(null, err.statusCode));
    });
};

/**
 * export stock in data with excel
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.exportSI = function(req, res, next) {
    debugCtrller("/controllers/stockIn/exportSI");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    var ep = EventProxy.create();

    //静态标题
    var conf = {};
    conf.cols = [{
        caption: '入库日期',
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
        caption: '供应商',
        type: 'string'
    }, {
        caption: '状态',
        type: 'string'
    }];

    StockIn.getAllStockInWithCondition( function(err, rows) {
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
                dataHandler(row.siDate),
                row.typeName,
                row.name,
                row.unit,
                row.num,
                row.price,
                row.amount,
                row.supplier,
                row.ptName
            ]);
        }

        conf.rows = arrayObj;
        var result = nodeExcel.execute(conf);
        var fileTitle = "StockIn_";
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename= " + fileTitle + (new Date().Format("yyyy-MM-dd")) + ".xlsx");
        res.end(result, 'binary');
    });
    function dataHandler (dataStr) {
        if (dataStr) {
            if (dataStr.indexOf("0000") < 0) {
                return (new Date(dataStr)).Format("yyyy-MM-dd");
            }
            return "";
        }else{
            return "";
        }
    }
};




