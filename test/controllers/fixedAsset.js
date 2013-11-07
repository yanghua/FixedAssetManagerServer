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
            'qrCode' : "2000901-02-0001"
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

    //test: fixedasset/:faId/detail
    it('should response data for fadetail', function (done) {
        var param = {
            faId : "12345"
        };

        app.request().get("/fixedasset/" + param.faId + "/detail").end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /user/:userId/fixedassets
    it('should response data', function (done) {
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
            faId    : 12345,
            reject  : 0
        };

        app.request().post("/fixedasset/rejection").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    /********************** fixed asset detail CRUD test start *********************/

    //test: /fixedasset/insertion (HOSTCOMPUTER)
    it('is testing func: /fixedasset/insertion for HOSTCOMPUTER', function (done) {
        var param = {
            faType        : "HOSTCOMPUTER",
            newId         : "65143",
            oldId         : "2",
            brand         : "",
            cpu           : "",
            cpuFrequency  : "",
            ram           : "",
            hd            : "",
            mac           : "",
            price         : "",
            purpose       : "",
            position      : "",
            remark        : ""
        };

        app.request().post("/fixedasset/insertion").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/:faId/modification (HOSTCOMPUTER)
    it('is testing func: /fixedasset/:faId/modification for HOSTCOMPUTER', function (done) {
        var param = {
            faType        : "HOSTCOMPUTER",
            newId         : "65143",
            oldId         : "3",
            brand         : "",
            cpu           : "",
            cpuFrequency  : "",
            ram           : "",
            hd            : "",
            mac           : "",
            price         : "",
            purpose       : "",
            position      : "",
            remark        : ""
        };

        app.request().post("/fixedasset/1/modification").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/insertion (MOBILE)
    it('is testing func: /fixedasset/insertion for MOBILE', function (done) {
        var param = {
            faType          : "MOBILE",
            newId           : "12",
            deviceName      : "2",
            type            : "",
            configure       : "",
            price           : "",
            purpose         : "",
            remark          : ""
        };

        app.request().post("/fixedasset/insertion").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/:faId/modification (MOBILE)
    it('is testing func: /fixedasset/:faId/modification for MOBILE', function (done) {
        var param = {
            faType          : "MOBILE",
            newId           : "1",
            deviceName      : "3",
            type            : "",
            configure       : "",
            price           : "",
            purpose         : "",
            remark          : ""
        };

        app.request().post("/fixedasset/1/modification").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/insertion (MONITOR)
    it('is testing func: /fixedasset/insertion for MONITOR', function (done) {
        var param = {
            faType          : "MONITOR",
            newId           : "12",
            oldId           : "2",
            brand           : "",
            size            : "",
            screenType      : "",
            purpose         : "",
            position        : "",
            remark          : ""
        };

        app.request().post("/fixedasset/insertion").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/:faId/modification (MONITOR)
    it('is testing func: /fixedasset/:faId/modification for MONITOR', function (done) {
        var param = {
            faType          : "MONITOR",
            newId           : "1",
            oldId           : "3",
            brand           : "",
            size            : "",
            screenType      : "",
            purpose         : "",
            position        : "",
            remark          : ""
        };

        app.request().post("/fixedasset/1/modification").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/insertion (NOTEBOOK)
    it('is testing func: /fixedasset/insertion for NOTEBOOK', function (done) {
        var param = {
            faType          : "NOTEBOOK",
            newId           : "143",
            oldId           : "2",
            type            : "",
            cpu             : "",
            ram             : "",
            hd              : "",
            price           : "",
            purpose         : "",
            serviceCode     : "",
            remark          : "",
            mac1            : "",
            mac2            : ""
        };

        app.request().post("/fixedasset/insertion").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/:faId/modification (NOTEBOOK)
    it('is testing func: /fixedasset/:faId/modification for NOTEBOOK', function (done) {
        var param = {
            faType          : "NOTEBOOK",
            newId           : "1",
            oldId           : "4",
            type            : "",
            cpu             : "",
            ram             : "",
            hd              : "",
            price           : "",
            purpose         : "",
            serviceCode     : "",
            remark          : "",
            mac1            : "",
            mac2            : ""
        };

        app.request().post("/fixedasset/1/modification").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/insertion (OFFICEEQUIPMENT)
    it('is testing func: /fixedasset/insertion for OFFICEEQUIPMENT', function (done) {
        var param = {
            faType          : "OFFICEEQUIPMENT",
            newId           : "11234",
            equipmentName   : "",
            type            : "",
            price           : "",
            purpose         : "",
            position        : "",
            supplier        : "",
            remark          : ""
        };

        app.request().post("/fixedasset/insertion").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/:faId/modification (OFFICEEQUIPMENT)
    it('is testing func: /fixedasset/:faId/modification for OFFICEEQUIPMENT', function (done) {
        var param = {
            faType          : "OFFICEEQUIPMENT",
            newId           : "1",
            equipmentName   : "1234",
            type            : "",
            price           : "",
            purpose         : "",
            position        : "",
            supplier        : "",
            remark          : ""
        };

        app.request().post("/fixedasset/1/modification").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/insertion (OFFICEFURNITURE)
    it('is testing func: /fixedasset/insertion for OFFICEFURNITURE', function (done) {
        var param = {
            faType          : "OFFICEFURNITURE",
            newId           : "1123",
            furnitureName   : "",
            amount          : "",
            price           : "",
            position        : "",
            supplier        : "",
            remark          : ""
        };

        app.request().post("/fixedasset/insertion").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/:faId/modification (OFFICEFURNITURE)
    it('is testing func: /fixedasset/:faId/modification for OFFICEFURNITURE', function (done) {
        var param = {
            faType          : "OFFICEFURNITURE",
            newId           : "1",
            furnitureName   : "123",
            amount          : "",
            price           : "",
            position        : "",
            supplier        : "",
            remark          : ""
        };

        app.request().post("/fixedasset/1/modification").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/insertion (OTHEREQUIPMENT)
    it('is testing func: /fixedasset/insertion for OTHEREQUIPMENT', function (done) {
        var param = {
            faType          : "OTHEREQUIPMENT",
            newId           : "1234",
            equipmentName   : "",
            supplier        : "",
            price           : "",
            remark          : ""
        };

        app.request().post("/fixedasset/insertion").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/:faId/modification (OTHEREQUIPMENT)
    it('is testing func: /fixedasset/:faId/modification for OTHEREQUIPMENT', function (done) {
        var param = {
            faType          : "OTHEREQUIPMENT",
            newId           : "1",
            equipmentName   : "3423",
            supplier        : "",
            price           : "",
            remark          : ""
        };

        app.request().post("/fixedasset/1/modification").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/insertion (SERVER)
    it('is testing func: /fixedasset/insertion for SERVER', function (done) {
        var param = {
            faType          : "SERVER",
            newId           : "165",
            purpose         : "",
            brand           : "",
            cpu             : "",
            cpuFrequency    : "",
            ram             : "",
            ramSize         : "",
            hd              : "",
            price           : "",
            liable          : "",
            position        : "",
            mac             : "",
            ipRange         : "",
            remark          : ""
        };

        app.request().post("/fixedasset/insertion").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/:faId/modification (SERVER)
    it('is testing func: /fixedasset/:faId/modification for SERVER', function (done) {
        var param = {
            faType          : "SERVER",
            newId           : "1",
            purpose         : "2",
            brand           : "",
            cpu             : "",
            cpuFrequency    : "",
            ram             : "",
            ramSize         : "",
            hd              : "",
            price           : "",
            liable          : "",
            position        : "",
            mac             : "",
            ipRange         : "",
            remark          : ""
        };

        app.request().post("/fixedasset/1/modification").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/insertion (VIRTUALEQUIPMENT)
    it('is testing func: /fixedasset/insertion for VIRTUALEQUIPMENT', function (done) {
        var param = {
            faType          : "VIRTUALEQUIPMENT",
            newId           : "14567",
            equipmentName   : "",
            supplier        : "",
            price           : "",
            remark          : ""
        };

        app.request().post("/fixedasset/insertion").setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    //test: /fixedasset/:faId/modification (VIRTUALEQUIPMENT)
    it('is testing func: /fixedasset/:faId/modification for VIRTUALEQUIPMENT', function (done) {
        var param = {
            faType          : "VIRTUALEQUIPMENT",
            newId           : "1",
            equipmentName   : "123",
            supplier        : "",
            price           : "",
            remark          : ""
        };

        app.request().post("/fixedasset/1/modification").setBody(param).end(function (res) {
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