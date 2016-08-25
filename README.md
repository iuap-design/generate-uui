# 使用Shell和Gulp构建产出UUI

## 使用说明

* 下载各仓库代码、npm依赖安装包、并执行产出

```
$ npm run deploy
```

## 产出说明

`3.1.0`起代码进行了重构，主要引入了模块管理的思想。

目前已完成以下5个仓库的重构工作

* neoui

* neoui-polyfill

* kero

* kero-adapter

* sparrow

未完成重构部分：

* neoui-grid
* neoui-tree

目前`generate-uui`产出思路如下：`

* 针对完成重构的部分，通过`npm install`安装`kero-adapter`,`neoui-polyfill`最新的npm包
  * `kero-adapter`通过`npm`的方式发布最新的`u.js`,`u.css`及相关静态`fonts`,`images`文件
  * `neoui-polyfill`通过`npm `的方式发布`u-polyfill.js
* 针对未重构的部分，通过`git clone`方式拉取最新的提交
* 将以上资源通过`gulp`配置输出到`dist`目录下。



## 产出资源

所有资源使用CDN的路径，比如想访问 `u.js`，则完整路径为 `http://design.yyuap.com/static/uui/3.1.0/js/u.js`。

```

│─uui
    └─3.1.0
        ├─css
        │      font-awesome.css
        │      grid.css
        │      grid.min.css
        │      tree.css
        │      u.css
        │      u.min.css
        │
        ├─fonts
        │      fontawesome-webfont.eot
        │      fontawesome-webfont.svg
        │      fontawesome-webfont.ttf
        │      fontawesome-webfont.woff
        │      fontawesome-webfont.woff2
        │      FontAwesome.otf
        │
        └─js
                u-grid.js
                u-grid.min.js
                u-polyfill.js
                u-polyfill.min.js
                u-tree.js
                u-tree.min.js
                u.js
                u.min.js

```
