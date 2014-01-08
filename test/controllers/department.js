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
  Date: 7/11/13
  Time: 17:31 PM
  Desc: department - the test of department
 */

var should = require("should");
var app    = require("../../app");

describe("department", function () {

    before(function (done) {
        app.listen(0, done);
    });

    after(function () {
        app.close();
    });

    //test: /departments
    it('is testing func: /departments', function (done) {
        app.request().get('/departments').end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

    it('is testing func: /manualinputdepts', function (done) {
        app.request().get("/manualinputdepts").end(function (res) {
            debugTest(res.bodyJSON());
            done();
        });
    });

});