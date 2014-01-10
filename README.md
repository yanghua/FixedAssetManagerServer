# overview

It's a node server used `grunt` as build tool and `pm2` as maintain tool.

## install

```
$ cd projectPath/

$ npm install
```

## grunt

```
$ npm install -g grunt-cli

$ cd projectPath/

$ grunt
```

## test
```
$ npm install -g mocha

$ cd projectPath/

$ mocha test
```

## debug
```
$ cd projectPath/

$ sudo DEBUG=$DEBUG node app.js
```

## run

* manual:

```
$ cd projectPath/

$ sudo node app.js
```

* automatic (use pm2):

```
$ cp projectPath/docs/dispatch.sh ~/dispatch.sh

$ cd ~

$ sudo sh dispatch.sh 
```


## project structure
```
root
   |-controllers                    --controller 控制器文件夹
   |-libs                           --library 库文件夹                        
   |-models                         --model 实体文件夹
   |-node_modules                   --node modules集合
   |-proxy                          --proxy :隔离controllers中的数据访问
   |-public                         --静态资源文件夹
   |-views                          --视图文件夹
   |-app.js                         --http server的入口，项目主文件
   |-appConfig.js                   --应用程序配置
   |-config.js                      --项目配置
   |-package.json                   --项目描述文件
   |-README.md                      --readme file
   |-routes.js                      --url 路由配置
   |-docs                           --项目文档资源文件夹
   |-screenshots                    --终端图片截图(iOS/Android)
   |-common                         --系统公用文件定义
   |-services                       --各种service集合
   |-backup                         --数据库备份文件目录
   |-uploads                        --文件上传目录
   |-test                           --测试文件
   
```

## module dependencies

* express
* mysql
* eventproxy
* validator
* ejs
* loader
* canvas
* captchagen
* crypto-js
* nodemailer
* qrcode
* pdfkit
* excel
* net-ping
* debug
* excel-export
* node-xlsx
* cron

devDependencies

* should
* mocha
* grunt
* grunt-contrib-uglify
* grunt-contrib-jshint
* grunt-contrib-csslint

## more detail
[使用Node.js完成的第一个项目的实践总结](http://blog.csdn.net/yanghua_kobe/article/details/17199417)

## reference

[nodeclub](https://github.com/cnodejs/nodeclub) - node.js Chinese Club

[Google Javascript 编程规范指南](http://alloyteam.github.io/JX/doc/specification/google-javascript.xml#%E4%BB%A3%E7%A0%81%E6%A0%BC%E5%BC%8F%E5%8C%96)