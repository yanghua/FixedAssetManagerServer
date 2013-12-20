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
  Date: Dec 19, 2013
  Time: 4:55 PM
  Desc: the test of stockInType
 */

var should = require("should");
var app    = require("../../app");
var config = require("../../config").initConfig();

describe("auth user test", function () {

    before(function (done) {
        app.listen(0, done);
    });

    after(function () {
        app.close();
    });

    it('is testing /stockintypes', function (done) {
        app.request().get("/stockintypes").end(function (res) {
            var resData = res.bodyJSON();
            debugOther(res.bodyJSON());
            should(resData.statusCode).equal(config.statusCode.STATUS_OK);
            done();
        });
    });

    it('is testing /stockintype/insertion', function (done) {
        app.request().post("/stockintype/insertion").setBody({ typeName : '上交' }).end(function (res) {
            var resData = res.bodyJSON();
            should(resData.statusCode).equal(config.statusCode.STATUS_OK);
            done();
        });
    });

    it('is testing /stockintype/modification', function (done) {
        app.request().post("/stockintype/modification")
            .setBody({ sitId : "12345", typeName : "asdf"})
            .end( function (res) {
                var resData = res.bodyJSON();
                should(resData.statusCode).equal(config.statusCode.STATUS_OK);
                done();
        });
    });

});
