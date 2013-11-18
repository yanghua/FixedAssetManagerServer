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

var user       = require("./controllers/user");
var fixedAsset = require("./controllers/fixedAsset");
var faType     = require("./controllers/faType");
var department = require("./controllers/department");
var others     = require("./controllers/others");
var login      = require("./controllers/login");
var logout     = require("./controllers/logout");

module.exports = function (app) {

    //views
    app.get("/apis", others.home);
    app.get("/", login.showLogin);
    app.post("/signin", login.signIn);
    app.get("/signout", logout.signOut);
    app.get("/fixedasset/printservice/:pageIndex?", fixedAsset.printService);
    app.get("/fixedasset/manage",fixedAsset.manage);
    app.get("/404",others.fourofour);
    //apis
    app.get("/user/:userId", user.getUserById);
    app.get("/user/:userId/fixedassets", fixedAsset.getFixedAssetListByUserID);
    app.get("/fixedasset/:faId/info", fixedAsset.getFixedAssetByfaID);
    app.get("/fatypes", faType.getAllFATypes);
    app.get("/departments", department.getAllDepartments);
    app.get("/fixedasset/:faId/existence", fixedAsset.checkExistence);

    app.get("/captchaImg", login.captchaImg);

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