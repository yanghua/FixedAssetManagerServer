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

## run
```
$ cd projectPath/

$ node app.js
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
* easymysql
* eventproxy
* validator

devDependencies

* should
* mocha

## screen shots - iOS
![ios-1](https://github.com/yanghua/FixedAssetManager_Server/raw/master/screenshots/ios/1.png)

## screen shots -android
>todo



## reference

[nodeclub](https://github.com/cnodejs/nodeclub) - node.js Chinese Club

[Google Javascript 编程规范指南](http://alloyteam.github.io/JX/doc/specification/google-javascript.xml#%E4%BB%A3%E7%A0%81%E6%A0%BC%E5%BC%8F%E5%8C%96)