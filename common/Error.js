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

function BaseError(message) {
    this.name       = "BaseError";
    this.message    = message || "Base Error.";
    this.statusCode = -1;
}

BaseError.prototype = new Error();
BaseError.prototype.constructor = BaseError;

function DataNotFoundError(message) {
    this.name       = "DataNotFoundError";
    this.message    = message || "Data not found Error.";
    this.statusCode = config.statusCode.STATUS_NOTFOUND;
}

DataNotFoundError.prototype = new BaseError();
DataNotFoundError.prototype.constructor = DataNotFoundError;


function ServerError(message) {
    this.name       = "ServerError";
    this.message    = message || "Server Error";
    this.statusCode = config.statusCode.STATUS_SERVER_ERROR;
}

ServerError.prototype = new BaseError();
ServerError.prototype.constructor = ServerError;

function InvalidParamError(message) {
    this.name       = "InvalidParamError";
    this.message    = message || "InvalidParam Error";
    this.statusCode = config.statusCode.STATUS_INVAILD_PARAMS;
}

InvalidParamError.prototype = new BaseError();
InvalidParamError.prototype.constructor = InvalidParamError;

function PageNotFoundError (message) {
    this.name       = "PageNotFoundError";
    this.message    = message || "InvalidParam Error";
}

PageNotFoundError.prototype = new BaseError();
PageNotFoundError.prototype.constructor = PageNotFoundError;

function DBError (message) {
    this.name       = "DBError";
    this.message    = message || "DBError";
    this.statusCode = config.statusCode.STATUS_DBERROR;
}

DBError.prototype = new DBError();
DBError.prototype.constructor = DBError;


global.BaseError         = BaseError;
global.ServerError       = ServerError;
global.InvalidParamError = InvalidParamError;
global.DataNotFoundError = DataNotFoundError;
global.PageNotFoundError = PageNotFoundError;
global.DBError           = DBError;