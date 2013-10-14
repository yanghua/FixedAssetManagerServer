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

var app     = express.createServer();

app.configure(function() {
    app.set("view engine", "html");
    app.set("views", path.join(__dirname, "views"));

});

app.use(express.bodyParser());
app.use(express.logger());

routes(app);

//launch it!
app.listen(8080);
console.log("the app server run at port :8080")

module.exports=app;

