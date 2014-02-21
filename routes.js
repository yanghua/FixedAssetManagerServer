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

var user              = require("./controllers/user");
var fixedAsset        = require("./controllers/fixedAsset");
var fixedAssetHistory = require("./controllers/fixedAssetHistory");
var faType            = require("./controllers/faType");
var department        = require("./controllers/department");
var others            = require("./controllers/others");
var login             = require("./controllers/login");
var logout            = require("./controllers/logout");
var company           = require("./controllers/company");
var authUser          = require("./controllers/authUser");

var giftCategory      = require("./controllers/giftCategory");
var stockInType       = require("./controllers/stockInType");
var gift              = require("./controllers/gift");
var paymentType       = require("./controllers/paymentType");
var stockIn           = require("./controllers/stockIn");
var stockOut          = require("./controllers/stockOut");
var inventory         = require("./controllers/inventory");
var limitation        = require("./controllers/limitation");

module.exports = function (app) {

    /************************************************************************/
    /*                Resful: URI Represent a Resource!!!                   */
    /************************************************************************/

    /********************************fixed asset*****************************/

    //html page
    // app.get("/", others.index);
    app.get("/", fixedAsset.manage);
    app.get("/qrtest", fixedAsset.handleQrcode);
    app.get("/apis", others.apis);
    app.get("/login", login.showLogin);
    app.post("/signin", login.signIn);
    app.get("/signout", logout.signOut);
    app.get("/fixedasset/printservice/:pageIndex/:timefrom?/:timeto?", fixedAsset.printService);
    app.get("/fixedasset/manage", fixedAsset.manage);
    app.get("/404", others.fourofour);
    app.get("/captchaImg", login.captchaImg);
    app.get("/fixedasset/:faId/edit", fixedAsset.edit);
    app.get("/fixedasset/create/:faId?", fixedAsset.create);
    app.post("/fixedasset/import/company/:companyId", fixedAsset.importFA);
    app.get("/fixedasset/batchCreate", fixedAsset.batchCreate);
    app.get("/fixedasset/excelExport/:companyId", fixedAsset.exportExcel);
    app.get("/addUser",login.addUser);
    app.get("/editpwd",login.editpwd);

    //apis
    app.get("/user/:userId", user.getUserById);
    app.get("/user/:userId/fixedassets", fixedAsset.getFixedAssetListByUserID);
    app.get("/fixedasset/:faId/info", fixedAsset.getFixedAssetByfaID);
    app.get("/fatypes", faType.getAllFATypes);
    app.get("/departments", department.getAllDepartments);
    app.get("/fixedasset/:faId/existence", fixedAsset.checkExistence);
    app.get("/fixedasset/:faId/history", fixedAssetHistory.faHistory);
    app.get("/department/:deptId/idelfixedasset/type/:typeId/page/:pageIndex?", fixedAsset.idleFixedAsset);
    app.get("/companies", company.companies);
    app.get("/fixedasset/conditionInfo", fixedAsset.conditionInfo);
    app.post("/fixedasset/retrieve", fixedAsset.retrieve);
    app.get("/fixedasset/getUserId/:userName",fixedAsset.getUserIdByUserName);
    app.post("/signup", authUser.create);
    // app.get("/authusers", authUser.allUsers);


    app.post("/fixedasset/inspection", fixedAsset.inspection);
    app.post("/fixedasset/rejection", fixedAsset.rejection);
    app.post("/fixedasset/insertion", fixedAsset.insertion);
    app.post("/fixedasset/:faId/recycle", fixedAsset.recycle);
    app.post("/fixedasset/:faId/modification", fixedAsset.modification);
    app.post("/fixedasset/:faId/allocation", fixedAsset.allocation);

    /************************************Gift********************************/

    //gift html page
    app.get("/gift", gift.gift);
    app.get("/gift/manage", gift.giftManage);
    app.get("/gift/storage", gift.storage);
    app.get("/gift/other", gift.other);

    app.get("/giftcategories", giftCategory.giftCategories);
    app.post("/giftcategory/insertion", giftCategory.insertion);
    app.post("/giftcategory/modification", giftCategory.modification);

    app.get("/stockintypes", stockInType.stockInTypes);
    app.post("/stockintype/insertion", stockInType.insertion);
    app.post("/stockintype/modification", stockInType.modification);

    app.post("/gifts", gift.gifts);
    app.post("/gift/insertion", gift.insertion);
    app.post("/gift/modification", gift.modification);
    app.post("/gift/deletion", gift.deletion);

    app.get("/paymenttypes", paymentType.paymentTypes);
    app.post("/paymenttype/insertion", paymentType.insertion);
    app.post("/paymenttype/modification", paymentType.modification);

    app.post("/stockins", stockIn.stockins);
    app.post("/stockin/insertion", stockIn.insertion);
    app.post("/stockin/modification", stockIn.modification);
    app.post("/stockin/deletion", stockIn.deletion);
    app.post("/stockin/import", stockIn.importSI);
    app.get("/stockin/export", stockIn.exportSI);

    app.post("/stockouts", stockOut.stockouts);
    app.post("/stockout/insertion", stockOut.insertion);
    app.post("/stockout/modification", stockOut.modification);
    app.post("/stockout/deletion", stockOut.deletion);
    app.get("/stockout/export",stockOut.exportSO);

    app.get("/limitations", limitation.limitations);
    app.post("/limitation/insertion", limitation.insertion);
    app.post("/limitation/modification", limitation.modification);
    app.post("/limitation/deletion", limitation.deletion);

    app.post("/inventories", inventory.inventories);
    app.get("/inventory/export",inventory.exportInv);
    
    app.get("/manualinputdepts", department.allManualInputDepts);
    app.get("/suppliers", stockIn.suppliers);


    //can't mapping router
    app.get("*", others.fourofour);
};