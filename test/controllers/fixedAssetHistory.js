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
  Desc: fixedAssetHistory - the test of fixedAsset history
 */

var should    = require("should");
var app       = require("../../app");
var FAHistory = require("../../proxy/fixedAssetHistory");

describe("fixedAsset", function () {

    before(function (done) {
        app.listen(0, done);
    });

    after(function () {
        app.close();
    });

    it('is testing func: insertHistoryRecord', function (done) {
        var obj = {};
        obj.atId   = "2002";
        obj.aetId  = "1234";
        obj.aetpId = "2";
        obj.userId = "3";
        obj.aeDesc = "4";
        obj.aeTime = "";

        // FAHistory.insertHistoryRecord(obj, function (err, data) {
        //     if (err) {
        //       console.log(err);
        //     }

        //     done();
        // });
        // 
        done();
    });

    //test: /fixedasset/:faId/history
    it('is testing func: /fixedasset/:faId/history', function (done) {
        app.request().get("/fixedasset/201307-03-0035/history").end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

});