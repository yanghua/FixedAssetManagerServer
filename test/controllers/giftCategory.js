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
  Date: Dec 17, 2013
  Time: 4:30 PM
  Desc: the test of gift category
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

    it('is testing /giftcategories', function (done) {
        app.request().get("/giftcategories").end(function (res) {
            var resData = res.bodyJSON();
            debugOther(res.bodyJSON());
            should(resData.statusCode).equal(config.statusCode.STATUS_OK);
            done();
        });
    });

    it('is testing /giftcategory/insertion', function (done) {
        app.request().post("/giftcategory/insertion").setBody({ name : '礼品' }).end(function (res) {
            var resData = res.bodyJSON();
            should(resData.statusCode).equal(config.statusCode.STATUS_OK);
            done();
        });
    });

    it('is testing /giftcategory/modification', function (done) {
        app.request()
            .post("/giftcategory/modification")
            .setBody({ categoryId : "12345", name : "礼品"})
            .end( function (res) {
                var resData = res.bodyJSON();
                should(resData.statusCode).equal(config.statusCode.STATUS_OK);
                done();
        });
    });

});

