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

var FixedAsset  = require("../proxy/fixedAsset");
var FAHistory   = require("../proxy/fixedAssetHistory");
var User        = require("../proxy/user");
var resUtil     = require("../libs/resUtil");
var config      = require("../config").initConfig();
var check       = require("validator").check;
var sanitize    = require("validator").sanitize;
var EventProxy  = require("eventproxy");
var path        = require("path");
var fs          = require("fs");
var parseXlsx   = require("excel");
var PDFDocument = require("pdfkit");
var nodeExcel   = require('excel-export');
var mailService = require("../services/mail");
require("../libs/DateUtil");

/**
 * get fixed asset by faId
 * @param  {object}   req  request
 * @param  {object}   res  response
 * @param  {Function} next next handler
 * @return {null}
 */
exports.getFixedAssetByfaID = function (req, res, next) {
    debugCtrller("controllers/fixedAsset/getFixedAssetByfaId");
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
            res.send(resUtil.generateRes(rows, config.statusCode.STATUS_OK));
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
    debugCtrller("controllers/fixedAsset/inspection");
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

            res.send(resUtil.generateRes(faInfo, config.statusCode.STATUS_OK));
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
    debugCtrller("controllers/fixedAsset/rejection");

    req.body.faId   = req.body.faId || "";
    req.body.reject = req.body.reject || 1;

    try {
        //check
        check(req.body.faId).notEmpty();
        check(req.body.reject).notEmpty();

        //sanitize
        req.body.faId = sanitize(sanitize(req.body.faId).trim()).xss();
        req.body.reject = sanitize(req.body.reject).toInt();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    var ep = EventProxy.create();

    FixedAsset.rejectFixedAsset(req.body, function (err, rows) {
        if (err) {
            ep.emitLater("error", err);
        } else {
            ep.emitLater("after_rejected");
        }
    });

    ep.once("after_rejected", function() {
        FixedAsset.getFixedAssetByfaID(req.body.faId, function(err, faInfo) {
            if (err) {
                return ep.emitLater("error", err);
            }

            ep.emitLater("after_getFAInfo", faInfo);
        });
    });

    ep.once("after_getFAInfo", function(faInfo) {

        var historyRecord       = {};
        historyRecord.atId   = faInfo.faDetail.newId;
        historyRecord.aetpId = 2;                //reject
        historyRecord.userId = faInfo.faDetail.userId;
        historyRecord.aeDesc = "";
        historyRecord.operateId = req.session.user.userId;
        historyRecord.aeTime = new Date().Format("yyyy-MM-dd hh:mm:ss");

        FAHistory.insertHistoryRecord(historyRecord, function (err, data) {
            if (err) {
                return ep.emitLater("error", err);
            }

            ep.emitLater("completed");
        });
    });

    ep.once("completed", function() {
        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });


    ep.fail(function (err) {
        res.send(resUtil.generateRes(null, err.statusCode));
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
    debugCtrller("controllers/fixedAsset/insertion");

    var faObj = req.body;
    var ep = EventProxy.create();

    FixedAsset.addFixedAsset(faObj, function (err, rows) {
        if (err) {
            return ep.emitLater("error", err);
        }

        ep.emitLater("after_insertion");
    });

    ep.once("after_insertion", function () {
        FixedAsset.getFixedAssetByfaID(faObj.newId, function(err, faInfo) {
            if (err) {
                return ep.emitLater("error", err);
            }

            ep.emitLater("after_getFAInfo", faInfo);
        });
    });

    ep.once("after_getFAInfo", function(faInfo) {

        var historyRecord    = {};
        historyRecord.atId   = faInfo.faDetail.newId;
        historyRecord.aetpId = 1;                //insert
        historyRecord.userId = faInfo.faDetail.userId;
        historyRecord.aeDesc = "";
        historyRecord.operateId = req.session.user.userId;
        historyRecord.aeTime = new Date().Format("yyyy-MM-dd");

        FAHistory.insertHistoryRecord(historyRecord, function (err, data) {
            if (err) {
                return ep.emitLater("error", err);
            }

            ep.emitLater("completed");
        });
    });

    ep.once("completed", function() {
        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });

    ep.fail(function (err) {
        res.send(resUtil.generateRes(null, err.statusCode));
    });

};

/**
 * recycle fixed asset
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.recycle = function (req, res, next) {
    debugCtrller("controllers/fixedAsset/recycle");

    var faId = req.params.faId || "";
    try {
        check(faId).notEmpty();
        faId = sanitize(sanitize(faId).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    var ep = EventProxy.create();
    var userId = "";

    //before retake , get the userId first!
    FixedAsset.getFixedAssetByfaID(faId, function (err, faInfo) {
        if (err) {
            return ep.emitLater("error", err);
        }

        //get the userId it's retaking from 
        userId = faInfo.faDetail.userId || "";
        ep.emitLater("after_getFAInfo");
    });

    ep.once("after_getFAInfo", function () {
        FixedAsset.recycleFixedAsset(faId, function (err, rows) {
            if (err) {
                return ep.emitLater("error", err);
            }

            ep.emitLater("after_retake");
        });
    });

    ep.once("after_retake", function () {
        var historyRecord       = {};
        historyRecord.atId   = faId;
        historyRecord.aetpId = 4;                //retake
        historyRecord.userId = userId;
        historyRecord.aeDesc = "";
        historyRecord.operateId = req.session.user.userId;
        historyRecord.aeTime = new Date().Format("yyyy-MM-dd");

        FAHistory.insertHistoryRecord(historyRecord, function (err, data) {
            if (err) {
                return ep.emitLater("error", err);
            }

            ep.emitLater("completed");
        });
    });

    ep.once("completed", function() {
        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });

    ep.fail(function (err) {
        res.send(resUtil.generateRes(null, err.statusCode));
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
    debugCtrller("controllers/fixedAsset/modification");

    var faId = req.params.faId || "";

    try {
        check(faId).notEmpty();
        faId = sanitize(sanitize(faId).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    var detailObj = req.body;

    var ep = EventProxy.create();

    var userId = detailObj.userId || "";
    var retake = false;

    //if userId is null ,it means retake this fixed asset
    if (userId.length === 0) {
        retake = true;
    }

    //before retake , get the userId first!
    FixedAsset.getFixedAssetByfaID(faId, function (err, faInfo) {
        if (err) {
            return ep.emitLater("error", err);
        }

        //get the userId it's retaking from 
        userId = faInfo.faDetail.userId || "";
        ep.emitLater("after_getFAInfo");
    });

    ep.once("after_getFAInfo", function() {
        FixedAsset.modifyFixedAsset(detailObj, faId, function (err, rows) {
            if (err) {
                return ep.emitLater("error", err);
            }

            if (retake) {
                ep.emitLater("after_retake");
            } else {
                ep.emitLater("completed");
            }
        });
    });

    ep.once("after_retake", function () {
        var historyRecord       = {};
        historyRecord.atId   = faId;
        historyRecord.aetpId = 4;                //retake
        historyRecord.userId = userId;
        historyRecord.aeDesc = "";
        historyRecord.operateId = req.session.user.userId;
        historyRecord.aeTime = new Date().Format("yyyy-MM-dd");

        FAHistory.insertHistoryRecord(historyRecord, function (err, data) {
            if (err) {
                return ep.emitLater("error", err);
            }

            ep.emitLater("completed");
        });
    });

    ep.once("completed", function() {
        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });

    ep.fail(function (err) {
        res.send(resUtil.generateRes(null, err.statusCode));
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
    debugCtrller("controllers/fixedAsset/getFixedAssetListByUserID");
    var userId = req.params.userId || "";

    try {
        check(userId).notEmpty();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    userId = sanitize(sanitize(userId).trim()).xss();

    FixedAsset.getFixedAssetListByUserID(userId, function (err, rows) {
        if (err) {
            debugCtrller(err);
            return res.send(resUtil.generateRes(null, err.statusCode));
        } 
            
        res.send(resUtil.generateRes(rows, config.statusCode.STATUS_OK));
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
    debugCtrller("controllers/fixedAsset/allocation");

    var faId   = req.body.faId   || "";
    var userId = req.body.userId || "";
    var deptId = req.body.deptId || "";

    try {
        check(faId).notEmpty();
        check(userId).notEmpty();
        check(deptId).notEmpty();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    faId   = sanitize(sanitize(faId).trim()).xss();
    userId = sanitize(sanitize(userId).trim()).xss();
    deptId = sanitize(sanitize(deptId).trim()).xss();

    var ep = EventProxy.create();

    FixedAsset.allocateFixedAsset({ userId : userId, newId : faId, departmentId : deptId }, function (err, rows) {
        if (err) {
            return ep.emitLater("error", err);
        }

        ep.emitLater("after_allocation");
    });

    ep.once("after_allocation", function() {
        var historyRecord       = {};
        historyRecord.atId   = faId;
        historyRecord.aetpId = 3;                //allocation
        historyRecord.userId = userId;
        historyRecord.aeDesc = "";
        historyRecord.operateId = req.session.user.userId;
        historyRecord.aeTime = new Date().Format("yyyy-MM-dd");

        FAHistory.insertHistoryRecord(historyRecord, function (err, data) {
            if (err) {
                return ep.emitLater("error", err);
            }

            ep.emitLater("completed");
        });
    });

    ep.once("completed", function () {
        res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });

    ep.fail(function(err) {
        res.send(resUtil.generateRes(null, err.statusCode));
    });
};

/**
 * check fixed asset existence
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.checkExistence = function (req, res, next) {
    debugCtrller("controllers/fixedAsset/checkExistence");

    var faId = req.params.faId || "";

    try {
        check(faId).notEmpty();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    faId = sanitize(sanitize(faId).trim()).xss();

    FixedAsset.checkFixedAssetByfaID(faId, function (err, hasFA) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        if (hasFA) {
            return res.send(resUtil.generateRes(1, config.statusCode.STATUS_OK));
        } else {
            return res.send(resUtil.generateRes(0, config.statusCode.STATUS_OK));
        }
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
    debugCtrller("controllers/fixedAsset/printService");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var pageIndex = req.params.pageIndex || 1;
    var timefrom  = req.params.timefrom || "";
    var timeto    = req.params.timeto || "";

    try {
        if (pageIndex === "") {
            pageIndex = 1;
        }
        pageIndex = sanitize(pageIndex).toInt();
        timefrom  = sanitize(timefrom).xss();
        timeto    = sanitize(timeto).xss();

        if (pageIndex < 1) {
            throw new InvalidParamError("the page index must be gt 1");
        }
    } catch (e) {
        pageIndex = 1;
    }

    var ep = EventProxy.create();
    if (timefrom.length !== 0) {
        if (timeto.length === 0) {
            return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
        }

        timefrom = parseFloat(timefrom);
        timeto   = parseFloat(timeto);
        
        timefrom = new Date(timefrom).Format("yyyy-MM-dd");
        timeto   = new Date(timeto).Format("yyyy-MM-dd");
    }

    FixedAsset.getqrCodeByPageIndex(pageIndex, timefrom, timeto, function (err, rows) {
        if (err) {
            return ep.emitLater("error", err);
        }

        ep.emitLater("after_getqrCode", rows);
    });

    ep.once("after_getqrCode", function (qrCodeList) {
        FixedAsset.getFixedAssetCount(timefrom, timeto, function (err, totalCount) {
            if (err) {
                return ep.emitLater("error", err);
            }

            var renderData = {};
            renderData.pageSize   = config.default_page_size;
            renderData.pageIndex  = pageIndex;
            renderData.total      = totalCount;
            renderData.qrCodeList = qrCodeList;
            
            res.render('subviews/print.html', 
                {renderData : renderData});
        });
    });


    ep.fail(function (err) {
        return res.send(resUtil.generateRes(null, err.statusCode));
    });
};

/**
 * render fixed asset manager page
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.manage = function (req, res, next) {
    debugCtrller("controllers/fixedasset->manager");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    
    res.render('subviews/manage.html');
};

/**
 * edit controller
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.edit = function (req, res, next) {
    debugCtrller("controllers/fixedasset->edit");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    
    res.render('subviews/edit');
};

/**
 * create controller
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.create = function (req, res, next) {
    debugCtrller("controllers/fixedasset->create");
    var faId = req.params.faId || "";
    var ep = EventProxy.create();
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    if(faId){
        var renderData = {};
        renderData.faId = faId;
        res.render('subviews/create', 
                {renderData : renderData});
       
    }else{
        res.render('subviews/create');
    }

    //error handler
    ep.fail(function (err) {
        res.send(resUtil.generateRes(null, err.statusCode));
    });
    
    
};

/**
 * batchCreate controller
 * @param  {obj}   req  [description]
 * @param  {obj}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.batchCreate = function (req, res, next) {
    debugCtrller("controllers/fixedasset/batchCreate");
    if (!req.session || !req.session.user){
        return res.redirect("/login");
    }
    
    res.render('subviews/batchCreate');
};

/**
 * get idle fixed asset list
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.idleFixedAsset = function (req, res, next) {
    debugCtrller("controllers/fixedasset/idleFixedAsset");

    var deptId    = req.params.deptId || "";
    var typeId    = req.params.typeId || 0;
    var pageIndex = req.params.pageIndex || 1;

    try {
        pageIndex = sanitize(pageIndex).toInt();
        typeId    = sanitize(typeId).toInt();

        if (pageIndex < 1) {
            throw new InvalidParamError("the page index must be gt 1");
        }

        if (typeId < 0) {
            throw new InvalidParamError("the typeId must >= 0");
        }

    } catch (e) {
        pageIndex = 1;
    }

    try {
        check(deptId).notEmpty();
        sanitize(sanitize(deptId).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    var ep = EventProxy.create();

    FixedAsset.getIdelFAListByDeptIdAndTypeId(deptId, typeId, pageIndex, function (err, rows) {
        if (err) {
                return ep.emitLater("error", err);
        }

        ep.emitLater("after_getIdelFixedAssetsByDeptId", rows);
    });

    ep.once("after_getIdelFixedAssetsByDeptId", function (idelFAList) {
        var tmp = idelFAList;

        FixedAsset.getIdelFACountByDeptIdAndTypeId(deptId, typeId, function (err, count) {
            if (err) {
                return ep.emitLater("error", err);
            }

            ep.emitLater("completed", tmp, count);
        });
    });

    ep.once("completed", function (idelFAList, idelFACount) {
        var data = {};
        data.pageSize   = config.default_page_size;
        data.pageIndex  = pageIndex;
        data.total      = idelFACount;
        data.idelFAList = idelFAList;

        return res.send(resUtil.generateRes(data, config.statusCode.STATUS_OK));
    });


    ep.fail(function (err) {
        return res.send(resUtil.generateRes(null, err.statusCode));
    });
};

/**
 * import fixed asset excel records
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.importFA = function (req, res, next) {
    debugCtrller("controllers/fixedasset/importFA");

    var companyId = req.params.companyId;
    var fileName  = req.files.file_source.name || "";
    var tmp_path  = req.files.file_source.path || "";

    try {
        check(fileName).notEmpty();
        check(tmp_path).notEmpty();
        check(companyId).notEmpty();
        fileName = sanitize(sanitize(fileName).trim()).xss();
        if (path.extname(fileName).indexOf("xls") === -1) {
            throw new InvalidParamError();
        }
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    var xlsxPath = path.resolve(__dirname, "../uploads/", fileName);

    var ep = EventProxy.create();

    fs.rename(tmp_path, xlsxPath, function (err) {
        if (err) {
            return ep.emitLater("error", new ServerError());
        }
        
        ep.emitLater("renamed_file");
    });

    ep.once("renamed_file", function () {
        ep.emitLater("after_deletedTmpFile");
    });

    ep.once("after_deletedTmpFile", function () {
        parseXlsx(xlsxPath, function (err, data) {
            if (err || !data) {
                return ep.emitLater("error", new ServerError());
            }

            return ep.emitLater("after_parsedExcelData", data);
        });
    });

    ep.once("after_parsedExcelData", function (excelData) {
        debugCtrller(excelData[0].length);
        if (excelData[0].length != 20) {
            return ep.emitLater("error", new InvalidParamError());
        }

        //remove first title array
        excelData.shift();
        FixedAsset.importFixedAssets(companyId, excelData, function () {
            fs.unlinkSync(xlsxPath);
            return res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
        });
    });

    ep.fail(function (err) {
        fs.unlinkSync(xlsxPath);
        return res.send(resUtil.generateRes(null, err.statusCode));
    });
};

/**
 * [handleQrcode description]
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {[type]}        [description]
 */
exports.handleQrcode = function (req, res, next) {
    debugCtrller("controllers/fixedAsset/handleQrcode");

    var ep = EventProxy.create();
    FixedAsset.updateQrcode('123123',function (err,qUri) {
        if (err) {
            return ep.emitLater("error", err);
        }

        ep.emitLater("loadpdf",qUri);
    });

    ep.fail(function (err) {
        res.send(resUtil.generateRes(null, err.statusCode));
    });

    ep.once("completed1", function (tem) {
        res.send("<img src='"+tem+"'/>");
    });

    var doc = new PDFDocument();
    ep.once("loadpdf", function (tem) {
        //doc.addPage();
        doc.text('Hello world!');
        var base64Data,binaryData;
        base64Data  =   tem.replace(/^data:image\/png;base64,/, "");
        base64Data  +=  base64Data.replace('+', ' ');
        binaryData  =   new Buffer(base64Data, 'base64').toString('binary');
        fs.writeFile("public/images/out/out.png", binaryData, "binary", function (err) {
            if(!err){
                doc.image('public/images/out/out.png', 100, 100);
            }
            ep.emitLater("completed");
        });
    });

    ep.once("completed",function () {
        doc.write('out.pdf');
        doc.output(function(string) {
          res.end(string);
        });
    });

};

/**
 * update all qrcode 
 * @param  {object}   req  the instance of requset
 * @param  {object}   res  the instance of response
 * @param  {Function} next [description]
 * @return {null}       
 */
exports.updateAllQrcode = function (req, res, next) {
    debugCtrller("controllers/fixedAsset/updateAllQrcode");
    var ep = EventProxy.create();
    FixedAsset.updateAllQrcode(function (err,args) {
        //to-do 
    });
};

/**
 * export data with excel 
 * @param  {[type]}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next 
 * @return {null}     send a file to client with all data from mysql database   
 */
exports.exportExcel = function (req, res, next) {
    debugCtrller("controllers/fixedAsset/exportExcel");
    var companyId    = req.params.companyId || "";

    try {
        check(companyId).notEmpty();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }
    var ep = EventProxy.create();

    //静态标题
    var conf ={};
    conf.cols = [
        {caption:'部门', type:'string'},
        {caption:'部门编号', type:'string'},
        {caption:'领用人', type:'string'},
        {caption:'领用人工号', type:'string'},
        {caption:'设备编号', type:'string'},
        {caption:'旧编号', type:'string'},
        {caption:'资产名称', type:'string'},
        {caption:'资产类型', type:'string'},
        {caption:'资产归属', type:'string'},
        {caption:'当前状态', type:'string'},
        {caption:'品牌', type:'string'},
        {caption:'型号', type:'string'},
        {caption:'规格', type:'string'},
        {caption:'金额', type:'string'},
        {caption:'购买日期', type:'string'},
        {caption:'领用日期', type:'string'},
        {caption:'快速服务代码', type:'string'},
        {caption:'Mac地址', type:'string'},
        {caption:'备注1', type:'string'},
        {caption:'备注2', type:'string'}                       
    ];

    FixedAsset.getExportData(companyId, function (err, rows) {
        if (err) {
            return ep.emitLater("error", err);
        }
        ep.emitLater("after_select", rows);
    });

    var arrayObj = []; 
    ep.once("after_select",function (rows) {
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            arrayObj.push([
                row.departmentId,
                row.departmentName,
                row.userName,
                row.userId,
                row.newId,
                row.oldId,
                row.assetName,
                row.typeId,
                row.assetBelong,
                row.currentStatus,
                row.brand,
                row.model,
                row.specifications,
                row.price,
                dataHandler(row.purchaseDate),
                dataHandler(row.possessDate),
                row.serviceCode,
                row.mac,
                row.remark1,
                row.remark2
            ]);
        }

        conf.rows = arrayObj;
        var result = nodeExcel.execute(conf);
        var fileTitle ;
        if (companyId-1){
            fileTitle = "yunzhi_";
        }else{
            fileTitle = "jinzhi_";
        }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename= "+fileTitle + (new Date().Format("yyyy-MM-dd"))+".xlsx");
        res.end(result, 'binary');
    });

    function dataHandler (dataStr) {
        if (dataStr) {
            if (dataStr != "0000-00-00") {
                return (new Date(dataStr)).Format("yyyy-MM-dd hh:mm:ss");
            }
            return "";
        }else{
            return "";
        }
    }
};

/**
 * get search condition info
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.conditionInfo = function (req, res, next) {
    debugCtrller("controllers/fixedAsset/conditionInfo");

    FixedAsset.getFixedAssetConditions(function (err, result) {
        if (err || !result) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(result, config.statusCode.STATUS_OK));
    });

};

/**
 * search the fixed asset
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.retrieve = function (req, res, next) {
    debugCtrller("controllers/fixedAsset/retrieve");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    FixedAsset.getFixedAssetListWithConditions(req.body, function (err, result) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(result, config.statusCode.STATUS_OK));
    });
};

exports.getUserIdByUserName = function (req, res, next) {
    debugCtrller("controllers/fixedAsset/getUserIdByUserName");
    var userName = req.params.userName || "";
    // if (!req.session || !req.session.user) {
    //     return res.redirect("/login");
    // }
    FixedAsset.getUserIdByUserName(userName,function (err, result) {
        if(err){
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        res.send(resUtil.generateRes(result, config.statusCode.STATUS_OK));
    });
};
