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
  Date: 16/10/13
  Time: 14:30 PM
  Desc: app - the test of server
 */

var app = require("../app");

describe("app.js", function () {
    before(function (done) {
        app.listen(0, done);
    });

    after(function () {
        app.close();
    });

    it("should / status 200", function (done) {
        app.request().get("/").end(function (res) {
            res.should.status(302);
            done();
        });
    });

});