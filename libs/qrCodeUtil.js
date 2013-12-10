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
  Date: 4/11/13
  Time: 15:45 PM
  Desc: qrCode - the helper of qrCode
  service url: https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=:qrCode (qrCode is param)
 */

var fs            = require("fs");
var https         = require("https");
var check         = require("validator").check;
var StringDecoder = require('string_decoder').StringDecoder;

//service:
var serviceUrl = "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=";

/**
 * get qrData from google service api
 * @param  {string}   qrCode   the code to be generated
 * @param  {Function} callback the call back func
 * @return {null}            
 */
exports.getQRData = function (qrCode, callback) {
    var code = qrCode || "";

    if (!check(qrCode).notEmpty()) {
        return callback(new InvalidParamError(), null);
    }

    https.get(serviceUrl + qrCode, function (res) {

        console.dir(res.headers);

        var expectedLen = res.headers["content-length"];
        var imgBytes = [];
        var receivedLen = 0;

        // var pngFileStream = fs.createWriteStream("/Users/yanghua/Desktop/test.png");

        res.on("data", function (data) {
            imgBytes.push(data);

            receivedLen += data.length;

            // pngFileStream.write(data);
        });

        res.on("end", function() {

            if (receivedLen == expectedLen) {
                // return callback(null, Buffer.concat(imgBytes).toString("base64"));
            } else {
                // return callback(new ServerError(), null);
            }

            // pngFileStream.end();
        });
    }).on("error", function (err) {
        return callback(new ServerError(), null);
    });
};


exports.decodeImgStr = function (enocodedImgStr, callback) {
    var decoder = new StringDecoder('base64');
    var imgBuffer = decoder.write(enocodedImgStr);
    decoder.end();
    return callback(null, imgBuffer);
};

exports.test = function () {
    QRCode.toDataURL("I am Yanghua !", function (err, url) {
        console.log(url);
    });
};