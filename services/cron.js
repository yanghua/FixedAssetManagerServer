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
  Date: Jan 2, 2014
  Time: 5:02 PM
  Desc: the service of cron
 */

var cronJob     = require('cron').CronJob;
var xlsx        = require("node-xlsx");
var mailService = require("./mail");
var Limitation  = require("../proxy/limitation");
var exec        = require("child_process").exec;
var util        = require("../libs/util");
var path        = require("path");
var config      = require("../config").initConfig();

/**
 * start e-mail notification for gift limitation
 * @param  {Function} callback the cb func
 * @return {null}            
 */
exports.startLimatationMailNotification = function (cronPattern, callback) {
    debugService("/services/cron/startLimatationMailNotification");
    var cp = cronPattern || "00 00 10 * * 1-5";

    var job = cronGenerator(cp, function() {
        generateGiftLimitationExcel(function (buffer) {
            mailService.sendMail({
                subject : "Gift limitation notification",
                attachments : [
                    {
                        fileName: "giftLimitationNotification.xlsx",
                        contents: buffer
                    }
                ]
            });
        });
    });

    job.start();
};

/**
 * start db backup service
 * @param  {String}   cronPattern the cron job pattern
 * @param  {Function} callback    the cb func
 * @return {null}               
 */
exports.startDBBackupService = function (cronPattern, callback) {
    debugService("/services/cron/startDBBackupService");

    var cp = cronPattern || "00 00 23 * * *";

    var job = cronGenerator(cp, function() {
        var backupFile = path.resolve(__dirname, "../backup/", new Date().Format("yyyy_MM_dd") + ".sql");
        var cmd = "mysqldump -h{0} -u{1} -p{2} fixedAsset > {3}".format(config.mysqlConfig.host,
                                                                        config.mysqlConfig.user,
                                                                        config.mysqlConfig.password,
                                                                        backupFile);

        exec(cmd, function (err, stdout, stderr) {
            if (err) {
                debugService(err);
            }

            debugService(stdout);
        });
    });

    job.start();
};

/**
 * start push db back up file with mail service
 * @param  {String}   cronPattern the cron job pattern
 * @param  {Function} callback    the cb func
 * @return {null}               
 */
exports.startPushDBBackupFileService = function (cronPattern, callback) {
    debugService("/services/cron/startPushDBBackupFileService");

    var cp = cronPattern || "00 30 23 */3 * *";
    var job = cronGenerator(cp, function () {
        var backupFile = path.resolve(__dirname, "../backup/", new Date().Format("yyyy_MM_dd") + ".sql");
        mailService.sendMail({
            subject : "DB backup Mail",
            attachments : [
                {
                    filePath: backupFile
                }
            ]
        });
    });

    job.start();
};

/**
 * cron job generator
 * @param  {String}   cronPattern the pattern of the cron
 * @param  {Function} doSomething the job func
 * @return {Object}             the real cron job obj
 */
function cronGenerator (cronPattern, doSomething) {
    var cp = cronPattern || "00 00 10 * * 1-5";
    var job = new cronJob({
        cronTime: cp,
        onTick: doSomething,
        start: false,
    });

    return job;
}


/**
 * generate gift limitation excel
 * @param  {Function} callback the cb func
 * @return {null}            
 */
function generateGiftLimitationExcel (callback) {
    debugService("/services/cron/generateGiftLimitationExcel");

    Limitation.getUnderLimatationGifts(function (items) {
        if (items) {
            var schema = {
                              worksheets: [
                                  {
                                      "name" : "礼品剩余数量提醒",
                                      "data" : [
                                         ["礼品名称", "品牌", "价格", "剩余库存数量", "警戒线"]
                                      ]
                                  }
                              ]
                        };

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var arr = [];
                arr.push(item.name);
                arr.push(item.brand);
                arr.push(item.price);
                arr.push(item.num);
                arr.push(item.limitNum);
                schema.worksheets[0].data.push(arr);
            }

            var buffer = xlsx.build(schema);

            callback(buffer);
        }
    });
}
