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
var FAHistory   = require("../proxy/fixedAssetHistory");
var User        = require("../proxy/user");
var resUtil     = require("../libs/resUtil");
var config      = require("../config").initConfig();
var check       = require("validator").check;
var sanitize    = require("validator").sanitize;
var EventProxy  = require("eventproxy");
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
        historyRecord["atId"]   = faInfo["faDetail"]["newId"];
        historyRecord["aetpId"] = 2;                //reject
        historyRecord["userId"] = faInfo["faDetail"]["userId"];
        historyRecord["aeDesc"] = "";
        historyRecord["aeTime"] = new Date().Format("yyyy-MM-dd hh:mm:ss");

        FAHistory.insertHistoryRecord(historyRecord, function (err, data) {
            if (err) {
                return ep.emitLater("error", err);
            }

            ep.emitLater("completed");
        });
    });

    ep.once("completed", function() {
        res.send(resUtil.generateRes(null, config.statusCode.SATUS_OK));
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
    console.log("******controllers/fixedAsset/insertion");

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

        var historyRecord       = {};
        historyRecord["atId"]   = faInfo["faDetail"]["newId"];
        historyRecord["aetpId"] = 1;                //insert
        historyRecord["userId"] = faInfo["faDetail"]["userId"];
        historyRecord["aeDesc"] = "";
        historyRecord["aeTime"] = new Date().Format("yyyy-MM-dd");

        FAHistory.insertHistoryRecord(historyRecord, function (err, data) {
            if (err) {
                return ep.emitLater("error", err);
            }

            ep.emitLater("completed");
        });
    });

    ep.once("completed", function() {
        res.send(resUtil.generateRes(null, config.statusCode.SATUS_OK));
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
    console.log("******controllers/fixedAsset/modification");

    var faId = req.params.faId || "";

    try {
        check(faId).notEmpty();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    faId = sanitize(sanitize(faId).trim()).xss();

    var detailObj = req.body;

    var ep = EventProxy.create();

    var userId = detailObj["userId"] || "";
    var retake = false;

    //if userId is null ,it means retake this fixed asset
    if (userId.length === 0) {
        retake = true;
    }

    //before retake , get the userId first!
    FixedAsset.getFixedAssetByfaID(faId, function(err, faInfo) {
        if (err) {
            return ep.emitLater("error", err);
        }

        //get the userId it's retaking from 
        userId = faInfo["faDetail"]["userId"] || "";
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
        historyRecord["atId"]   = faId;
        historyRecord["aetpId"] = 4;                //retake
        historyRecord["userId"] = userId;
        historyRecord["aeDesc"] = "";
        historyRecord["aeTime"] = new Date().Format("yyyy-MM-dd");

        FAHistory.insertHistoryRecord(historyRecord, function (err, data) {
            if (err) {
                return ep.emitLater("error", err);
            }

            ep.emitLater("completed");
        });
    });

    ep.once("completed", function() {
        res.send(resUtil.generateRes(null, config.statusCode.SATUS_OK));
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
        historyRecord["atId"]   = faId;
        historyRecord["aetpId"] = 3;                //allocation
        historyRecord["userId"] = userId;
        historyRecord["aeDesc"] = "";
        historyRecord["aeTime"] = new Date().Format("yyyy-MM-dd");

        FAHistory.insertHistoryRecord(historyRecord, function (err, data) {
            if (err) {
                return ep.emitLater("error", err);
            }

            ep.emitLater("completed");
        });
    });

    ep.once("completed", function () {
        res.send(resUtil.generateRes(null, config.statusCode.SATUS_OK));
    })

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
    console.log("******controllers/fixedAsset/checkExistence");

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
            return res.send(resUtil.generateRes(1, config.statusCode.SATUS_OK));
        } else {
            return res.send(resUtil.generateRes(0, config.statusCode.SATUS_OK));
        }
    });
}

/**
 * print service 
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.printService = function (req, res, next) {
    console.log("******controllers/fixedAsset/printService");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    var pageIndex = req.params.pageIndex || 1;

    try {
        if (pageIndex === "") {
            pageIndex = 1;
        }
        pageIndex = sanitize(pageIndex).toInt();

        if (pageIndex < 1) {
            throw new InvalidParamError("the page index must be gt 1");
        }
    } catch (e) {
        pageIndex = 1;
    }

    var ep = EventProxy.create();

    FixedAsset.getqrCodeByPageIndex(pageIndex, function (err, rows) {
        if (err) {
            return ep.emitLater("error", err);
        }

        ep.emitLater("after_getqrCode", rows);
    });

    ep.once("after_getqrCode", function (qrCodeList) {
        FixedAsset.getFixedAssetCount(function (err, totalCount) {
            if (err) {
                return ep.emitLater("error", err);
            }

            var renderData = {};
            renderData["pageSize"]   = config.default_page_size;
            renderData["pageIndex"]  = pageIndex;
            renderData["total"]      = totalCount;
            renderData["qrCodeList"] = qrCodeList;

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
    console.log("******controllers/fixedasset->manager");

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
    console.log("******controllers/fixedasset->edit");

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
    console.log("******controllers/fixedasset->create");

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    
    res.render('subviews/create');
};

/**
 * get idle fixed asset list
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.idleFixedAsset = function (req, res, next) {
    console.log("######controllers/idleFixedAsset");

    var deptId    = req.params.deptId || "";
    var pageIndex = req.params.pageIndex || 1;

    try {
        if (pageIndex === "") {
            pageIndex = 1;
        }
        pageIndex = sanitize(pageIndex).toInt();

        if (pageIndex < 1) {
            throw new InvalidParamError("the page index must be gt 1");
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

    FixedAsset.getIdelFixedAssetsByDeptId(deptId, pageIndex, function (err, rows) {
        if (err) {
                return ep.emitLater("error", err);
        }

        ep.emitLater("after_getIdelFixedAssetsByDeptId", rows);
    });

    ep.once("after_getIdelFixedAssetsByDeptId", function (idelFAList) {
        var tmp = idelFAList;

        FixedAsset.getIdelFixedAssetCountByDeptId(deptId, function (err, count) {
            if (err) {
                return ep.emitLater("error", err);
            }

            ep.emitLater("completed", tmp, count);
        });
    });

    ep.once("completed", function (idelFAList, idelFACount) {
        var data = {};
        data["pageSize"]   = config.default_page_size;
        data["pageIndex"]  = pageIndex;
        data["total"]      = idelFACount;
        data["qrCodeList"] = idelFAList;

        return res.send(resUtil.generateRes(data, config.statusCode.SATUS_OK));
    });


    ep.fail(function (err) {
        return res.send(resUtil.generateRes(null, err.statusCode));
    });
};