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
  Date: 10/10/13
  Time: 18:30 PM
  Desc: fixedAsset - base class
 */

/*
 routes - the router of url request
 */

//mode
'use strict';

var user              = require("./controllers/user");
var fixedAsset        = require("./controllers/fixedAsset");
var fixedAssetHistory = require("./controllers/fixedAssetHistory");
var faType            = require("./controllers/faType");
var department        = require("./controllers/department");
var others            = require("./controllers/others");
var login             = require("./controllers/login");
var logout            = require("./controllers/logout");
// var authUser          = require("./controllers/authUser");

module.exports = function (app) {

    //views
    app.get("/", others.index);
    app.get("/qrtest",fixedAsset.handleQrcode);
    app.get("/apis", others.apis);
    app.get("/login", login.showLogin);
    app.post("/signin", login.signIn);
    app.get("/signout", logout.signOut);
    app.get("/fixedasset/printservice/:pageIndex/:timefrom?/:timeto?", fixedAsset.printService);
    app.get("/fixedasset/manage",fixedAsset.manage);
    app.get("/404",others.fourofour);
    app.get("/captchaImg", login.captchaImg);
    app.get("/fixedasset/:faId/edit", fixedAsset.edit);
    app.get("/fixedasset/create", fixedAsset.create);
    app.post("/fixedasset/import", fixedAsset.importFA);
    app.get("/fixedasset/batchCreate",fixedAsset.batchCreate);
    app.get("/fixedasset/excelExport",fixedAsset.exportExcel);

    //apis
    app.get("/user/:userId", user.getUserById);
    app.get("/user/:userId/fixedassets", fixedAsset.getFixedAssetListByUserID);
    app.get("/fixedasset/:faId/info", fixedAsset.getFixedAssetByfaID);
    app.get("/fatypes", faType.getAllFATypes);
    app.get("/departments", department.getAllDepartments);
    app.get("/fixedasset/:faId/existence", fixedAsset.checkExistence);
    app.get("/fixedasset/:faId/history", fixedAssetHistory.faHistory);
    app.get("/department/:deptId/idelfixedasset/type/:typeId/page/:pageIndex?", fixedAsset.idleFixedAsset);
    // app.post("/authuser/create", authUser.create);
    // app.get("/authusers", authUser.allUsers);

    //can't mapping router
    app.get("*", others.fourofour);
    

    /************************************************************************/
    /*                Resful: URI Represent a Resource!!!                   */
    /************************************************************************/
    //params:qrCode
    app.post("/fixedasset/inspection", fixedAsset.inspection);

    //params:faId / reject
    app.post("/fixedasset/rejection", fixedAsset.rejection);

    //params:faType / ...(the field's key and value pair)
    app.post("/fixedasset/insertion", fixedAsset.insertion);

    app.post("/fixedasset/:faId/modification", fixedAsset.modification);
    app.post("/fixedasset/:faId/allocation", fixedAsset.allocation);

};