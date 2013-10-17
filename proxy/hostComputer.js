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
  Date: 17/10/13
  Time: 15:03 AM
  Desc: fixedAsset(hostComputer) - the controller of fixedAsset
 */


var mysqlUtil    = require("../libs/mysqlUtil"),
mysqlClient      = mysqlUtil.getMysqlClient();

/**
 * get host computer by id
 * @param  {string} hcId host computer id
 * @param  {Function} callback call back func
 * @return {null}      
 */
exports.getHostComputerByID = function (hcId, callback) {
    console.log("##########proxy/hostComputer/getHostComputerByID");
    mysqlClient.query({
        sql     : "SELECT * FROM HOSTCOMPUTER WHERE newId = :newId",
        params  : {
            "newId"  : hcId
        }
    }, function (err, rows){
        if (err != null) {
            console.log("getHostComputerByID error:"+err);
        }else{            
            callback(err, rows);
        }
    });
};