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
  Time: 17:30 PM
  Desc: app - the server
 */


var fs      = require("fs");
var path    = require("path");
var express = require("express");
var routes  = require("./routes");
var common  = require("./common/Error");

var app     = express.createServer();

//config for all env
app.configure(function () {

    //reference:
    //http://stackoverflow.com/questions/1335851/what-does-use-strict-do-in-javascript-and-what-is-the-reasoning-behind-it
    "use strict";
    //template engine
    app.set('view engine', 'html');
    /*jslint nomen: true*/
    app.set('views', path.join(__dirname, 'views'));
    /*jslint nomen: false*/
    app.set("view options", {layout : false});
    app.register('.html', require('ejs'));

    //middleware
    app.use(express.logger());
    app.use(express.bodyParser());
});

var maxAge = 3600000 * 24 * 30;
/*jslint nomen: true*/
var staticDir = path.join(__dirname, 'public');
/*jslint nomen: false*/

//config for devp env
app.configure('development', function () {
    "use strict";
    app.use("/public", express.static(staticDir));
    //error / exception handler
    app.use(express.errorHandler(
        { showStack : true, dumpException : true }
    ));
});


//config for production env
// app.configure("production", function () {
//     "use strict";
// });


routes(app);

//launch it!
app.listen(8088);
console.log("the app server run at port :8088");

module.exports = app;

