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
  Date: 13/11/13
  Time: 16:49 PM
  Desc: util - the helper methods
 */

//mode:
'use strict';

var debug4Ctrller   = require("debug")("controller");
var debug4Proxy     = require("debug")("proxy");
var debug4Lib       = require("debug")("lib");
var debug4Test      = require("debug")("test");
var debug4Other     = require("debug")("other");

global.debugCtrller = debug4Ctrller;
global.debugProxy   = debug4Proxy;
global.debugLib     = debug4Lib;
global.debugTest    = debug4Test;
global.debugOther   = debug4Other;

/**
 * generate guid
 */
exports.GUID = function () {
    var guid = "";
    for (var i = 1; i <= 32; i++){
      var n = Math.floor(Math.random()*16.0).toString(16);
      guid +=   n;
      if((i==8)||(i==12)||(i==16)||(i==20))
        guid += "-";
    }
    return guid; 
};