/*
  #!/usr/local/bin/node
  -*- coding:utf-8 -*-
 
  Copyright 2013 yanghua Inc. All Rights Reserved.
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file exceqt in compliance with the License.
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
  Date: 29/10/13
  Time: 10:43 AM
  Desc: the definition of sql patterns
 */

//mode
'use strict';

exports.getSqlConfig = function () {
    var SQL_PATTERN_CONFIG = {

        "HOSTCOMPUTER_INSERT"       : "INSERT INTO HOSTCOMPUTER " +
                                      "VALUES(:newId, :oldId, :brand, :cpu, :cpuFrequency, " +
                                      " :ram, :hd, :mac, :price, :purpose, :position, :remark)",

        "HOSTCOMPUTER_MODIFY"       : "UPDATE HOSTCOMPUTER " +
                                      " SET oldId=:oldId, brand=:brand, cpu=:cpu, " +
                                      "cpuFrequency=:cpuFrequency, ram=:ram, hd=:hd," +
                                      " mac=:mac, price=:price, purpose=:purpose, " +
                                      "position=:position, remark=:remark " +
                                      " WHERE newId=:newId",

        "MOBILE_INSERT"             : "INSERT INTO MOBILE " +
                                      "VALUES(:newId, :deviceName, :type, :configure, :price, " +
                                      ":purpose, :remark)",

        "MOBILE_MODIFY"             : "UPDATE MOBILE " +
                                      " SET deviceName=:deviceName, type=:type, " +
                                      "configure=:configure, price=:price, " +
                                      "purpose=:purpose, remark=:remark " +
                                      " WHERE newId=:newId",

        "MONITOR_INSERT"            : "INSERT INTO MONITOR " +
                                      "VALUES(:newId, :oldId, :brand, :size, :screenType, " +
                                      ":purpose, :position, :remark)",

        "MONITOR_MODIFY"            : "UPDATE MONITOR " +
                                      " SET oldId=:oldId, brand=:brand, size=:size, " +
                                      " screenType=:screenType,  purpose=:purpose, position=:position, " +
                                      " remark=:remark WHERE newId=:newId",

        "NOTEBOOK_INSERT"           : "INSERT INTO NOTEBOOK " +
                                      "VALUES(:newId, :oldId, :type, :cpu, :ram, :hd, :price, :purpose, " +
                                      ":serviceCode, :remark, :mac1, :mac2)",

        "NOTEBOOK_MODIFY"           : "UPDATE NOTEBOOK " +
                                      " SET oldId=:oldId, type=:type, cpu=:cpu, " +
                                      "ram=:ram, hd=:hd, price=:price, purpose=:purpose, " +
                                      "serviceCode=:serviceCode, remark=:remark, " +
                                      "Mac1=:Mac1, Mac2=:Mac2 " +
                                      " WHERE newId=:newId",

        "OFFICEEQUIPMENT_INSERT"    : "INSERT INTO OFFICEEQUIPMENT " +
                                      "VALUES(:newId, :equipmentName, :type, :price, :purpose, " +
                                      ":position, :supplier, :remark)",

        "OFFICEEQUIPMENT_MODIFY"    : "UPDATE OFFICEEQUIPMENT " +
                                      " SET equipmentName=:equipmentName, price=:price, " +
                                      " purpose=:purpose, position=:position, " +
                                      " supplier=:supplier, remark=:remark " +
                                      " WHERE newId=:newId",

        "OFFICEFURNITURE_INSERT"    : "INSERT INTO OFFICEFURNITURE " +
                                      "VALUES(:newId, :furnitureName, :amount, :price, :position, " +
                                      ":supplier, :remark)",

        "OFFICEFURNITURE_MODIFY"    : "UPDATE OFFICEFURNITURE " +
                                      " SET furnitureName=:furnitureName, amount=:amount, " +
                                      " price=:price, position=:position, " +
                                      " supplier=:supplier, remark=:remark " +
                                      " WHERE newId=:newId",

        "OTHEREQUIPMENT_INSERT"     : "INSERT INTO OTHEREQUIPMENT " +
                                      "VALUES(:newId, :equipmentName, :supplier, :price, :remark)",

        "OTHEREQUIPMENT_MODIFY"     : "UPDATE OTHEREQUIPMENT " +
                                      " SET equipmentName=:equipmentName, supplier=:supplier, " +
                                      " price=:price, remark=:remark " +
                                      " WHERE newId=:newId",

        "SERVER_INSERT"             : "INSERT INTO SERVER " +
                                      "VALUES(:newId, :purpose, :brand, :cpu, :cpuFrequency, " +
                                      " :ram, :ramSize, :ramFrequency, :hd, :price, :liable, " +
                                      " :position, :mac, :ipRange, :remark)",

        "SERVER_MODIFY"             : "UPDATE SERVER " +
                                      " SET purpose=:purpose, brand=:brand, cpu=:cpu, " +
                                      " cpuFrequency=:cpuFrequency, ram=:ram, " +
                                      " ramSize=:ramSize, ramFrequency=:ramFrequency, " +
                                      " hd=:hd, price=:price, liable=:liable ,position=:position, " +
                                      " mac=:mac, ipRange=:ipRange, remark=:remark " +
                                      " WHERE newId=:newId",

        "VIRTUALEQUIPMENT_INSERT"   : "INSERT INTO VIRTUALEQUIPMENT " +
                                      "VALUES(:newId, :equipmentName, :supplier, :price, :remark)",

        "VIRTUALEQUIPMENT_MODIFY"   : "UPDATE VIRTUALEQUIPMENT " +
                                      " SET equipmentName=:equipmentName, supplier=:supplier, " +
                                      "price=:price, remark=:remark " +
                                      " WHERE newId=:newId",
    };

    return SQL_PATTERN_CONFIG;
};