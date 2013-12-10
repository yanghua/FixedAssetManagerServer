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
  Date: Dec 5, 2013
  Time: 11:11 AM
  Desc: the test of authUser
 */

var should = require("should");
var app    = require("../../app");

describe("auth user test", function () {

    before(function (done) {
        app.listen(0, done);
    });

    after(function () {
        app.close();
    });

    //test: /authuser/create
    it('is testing func: /authuser/create', function (done) {

        var param = {
            uid   : "lzc",
            pwd   : "adminn",
            uName : "刘志成"
        };

        app.request().post('/departments').setBody(param).end(function (res) {
            console.dir(res.bodyJSON());
            done();
        });
    });

});