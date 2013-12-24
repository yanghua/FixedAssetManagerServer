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
  Date: 12/10/13
  Time: 10:00 PM
  Desc: define config info
 */

/**
 * init config info
 * @return {object} config-info object
 */
function initConfig() {
    var configInfo = {

        //mysql max connections
        default_max_conns : 50,

        // mysqlConfig       : {
        //     "host"      : "172.16.206.16",
        //     "user"      : "root",
        //     "password"  : "123456",
        //     "database"  : "fixedAsset"
        // },

        mysqlConfig       : {
            "host"      : "127.0.0.1",
            "user"      : "root",
            "password"  : "123456",
            "database"  : "fixedAsset"
        },

        default_page_size : 50,

        statusCode        : {
            STATUS_OK                 : 0,
            STATUS_NOTFOUND           : 1,        //means data not found not url request
            STATUS_SERVER_ERROR       : 2,
            STATUS_INVAILD_PARAMS     : 3,
            STATUS_DBERROR            : 4
            //....
        },

        faType            : {
            ENUM_HC         : "HOSTCOMPUTER",
            ENUM_MOB        : "MOBILE",
            ENUM_MON        : "MONITOR",
            ENUM_NOT        : "NOTEBOOK",
            ENUM_OE         : "OFFICEEQUIPMENT",
            ENUM_OF         : "OFFICEFURNITURE",
            ENUM_OTE        : "OTHEREQUIPMENT",
            ENUM_SERVER     : "SERVER",
            ENUM_VE         : "VIRTUALEQUIPMENT"
        }
    };

    return configInfo;
}

//exports
exports.initConfig = initConfig;