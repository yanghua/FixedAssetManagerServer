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
  Desc: fixedAsset - the test of fixedAsset
 */

//mode:
'use strict';

var should = require("should");
var app    = require("../../app");

describe("fixedAsset", function () {

    before(function (done) {
        app.listen(0, done);
    });

    after(function () {
        app.close();
    });

    //test: /fixedasset/inspection (success)
    it('should response data', function (done) {
        var param = {
            'qrCode' : "2000901-03-0001"
        };
        app.request().post('/fixedasset/inspection').setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/inspection (failure)
    it('should enter error handler', function (done) {
        var param = {
            'qrCode' : "#####"
        };
        app.request().post('/fixedasset/inspection').setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: fixedasset/:faId/info
    it('should response data', function (done) {
        var param = {
            faId : "12345"
        };

        app.request().get("/fixedasset/" + param.faId + "/info").end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /user/:userId/fixedassets
    it('is testing func: /user/:userId/fixedassets', function (done) {
        var param = {
            userId : "01312100"
        };

        app.request().get("/user/" + param.userId + "/fixedassets").end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/rejection
    it('is testing func: reject fixed asset', function (done) {
        var param = {
            faId    : "2000901-03-0001",
            reject  : 0
        };

        app.request().post("/fixedasset/rejection").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    /********************** fixed asset detail CRUD test start *********************/

    //test: /fixedasset/insertion
    it('is testing func: /fixedasset/insertion', function (done) {
        var param = {
            newId               : "2",
            oldId               : "",
            userId              : "",
            departmentId        : "",
            typeId              : "",
            assetName           : "",
            assetBelong         : "",
            currentStatus       : "",
            brand               : "",
            model               : "",
            specifications      : "",
            amount              : "",
            price               : "",
            purchaseDate        : "",
            possessDate         : "",
            serviceCode         : "",
            mac                 : "",
            reject              : "",
            rejectDate          : "",
            remark1             : "",
            remark2             : "",
            qrcode              : ""
        };

        app.request().post("/fixedasset/insertion").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/:faId/modification
    it('is testing func: /fixedasset/:faId/modification', function (done) {
        var param = {
            newId               : "2",
            oldId               : "1",
            userId              : "2",
            departmentId        : "3",
            typeId              : "4",
            assetName           : "5",
            assetBelong         : "",
            currentStatus       : "",
            brand               : "",
            model               : "",
            specifications      : "",
            amount              : "",
            price               : "",
            purchaseDate        : "",
            possessDate         : "",
            serviceCode         : "",
            mac                 : "",
            reject              : "",
            rejectDate          : "",
            remark1             : "",
            remark2             : ""
        };

        app.request().post("/fixedasset/2/modification").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    /********************** fixed asset detail CRUD test end *********************/

    it('is testing func: /fixedasset/:faId/allocation', function (done) {
        var param = {
            faId        : "65143",
            userId      : "123456"
        };

        app.request().post("/fixedasset/65143/allocation").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });

    });

});