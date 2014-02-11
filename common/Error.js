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
  Date: 22/10/13
  Time: 9:50 PM
  Desc: Error definition and inherit
 */

var config = require("../config").initConfig();
var assert = require("assert");
var util   = require("util");

function DataNotFoundError(message) {
    Error.call(this);
    this.name       = "DataNotFoundError";
    this.message    = message || "Data not found Error.";
    this.statusCode = config.statusCode.STATUS_NOTFOUND;
}

util.inherits(DataNotFoundError, Error);

function ServerError(message) {
    Error.call(this);
    this.name       = "ServerError";
    this.message    = message || "Server Error";
    this.statusCode = config.statusCode.STATUS_SERVER_ERROR;
}

util.inherits(ServerError, Error);

function InvalidParamError(message) {
    Error.call(this);
    this.name       = "InvalidParamError";
    this.message    = message || "InvalidParam Error";
    this.statusCode = config.statusCode.STATUS_INVAILD_PARAMS;
}

util.inherits(InvalidParamError, Error);

function PageNotFoundError (message) {
    Error.call(this);
    this.name       = "PageNotFoundError";
    this.message    = message || "InvalidParam Error";
    this.statusCode = 404;
}

util.inherits(PageNotFoundError, Error);

function DBError (message) {
    Error.call(this);
    this.name       = "DBError";
    this.message    = message || "DBError";
    this.statusCode = config.statusCode.STATUS_DBERROR;
}

util.inherits(DBError, Error);

global.ServerError       = ServerError;
global.InvalidParamError = InvalidParamError;
global.DataNotFoundError = DataNotFoundError;
global.PageNotFoundError = PageNotFoundError;
global.DBError           = DBError;