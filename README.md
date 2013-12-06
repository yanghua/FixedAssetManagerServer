# overview

It's a node server.

## install

```
$ cd projectPath/

$ npm install
```

## test
```
$ npm install -g mocha

$ cd projectPath/

$ mocha test
```

## debug
```
$ cd cd projectPath/

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

devDependencies

* should
* mocha

## screen shots - iOS
>TODO

## screen shots -android
>TODO



## reference

[nodeclub](https://github.com/cnodejs/nodeclub) - node.js Chinese Club

[Google Javascript 编程规范指南](http://alloyteam.github.io/JX/doc/specification/google-javascript.xml#%E4%BB%A3%E7%A0%81%E6%A0%BC%E5%BC%8F%E5%8C%96)