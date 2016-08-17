# 使用Shell和Gulp构建产出UUI

## 使用说明

* 准备工作：项目依赖到`npm`,考虑下载困难等问题，依赖源改为`cnpm`,如未安装，请优先执行以下操作

```
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
```

> cnpm安装具体可参照[镜像官网](https://npm.taobao.org/)

* 下载各仓库代码、npm依赖安装包、并执行产出

```
$ npm run deploy
```

## 产出资源

所有资源使用CDN的路径，比如想访问 `model.js`，则完整路径为 `http://design.yyuap.com/static/datatable/3.0.1/js/model.js`。

```
├─datatable
│  └─3.0.1
│      └─js
│              model.js
│              model.min.js
│              u-model.js
│              u-model.min.js
│
├─datetimepicker
│  └─1.0.0
│      ├─css
│      │      date.css
│      │      date.min.css
│      │
│      └─js
│              date.js
│              date.min.js
│              u-date.js
│              u-date.min.js
│
├─director
│      director.js
│      director.min.js
│
├─font-awesome
│  ├─css
│  │      font-awesome.css
│  │      font-awesome.min.css
│  │
│  └─fonts
│          fontawesome-webfont.eot
│          fontawesome-webfont.svg
│          fontawesome-webfont.ttf
│          fontawesome-webfont.woff
│          fontawesome-webfont.woff2
│          FontAwesome.otf
│
├─grid
│  └─3.0.1
│      ├─css
│      │      grid.css
│      │      grid.min.css
│      │
│      └─js
│              grid.js
│              grid.min.js
│              u-grid.js
│              u-grid.min.js
│
├─iuap-design
│  └─3.0.2
│      ├─css
│      │      font-awesome.css
│      │      u-extend.css
│      │      u-extend.min.css
│      │      u.css
│      │      u.min.css
│      │
│      ├─fonts
│      │      fontawesome-webfont.eot
│      │      fontawesome-webfont.svg
│      │      fontawesome-webfont.ttf
│      │      fontawesome-webfont.woff
│      │      fontawesome-webfont.woff2
│      │      FontAwesome.otf
│      │
│      └─js
│              u-polyfill.js
│              u-polyfill.min.js
│              u-ui.js
│              u-ui.min.js
│
├─jquery
│      jquery-1.11.2.js
│      jquery-1.9.1.min.js
│
├─knockout
│      knockout-3.2.0.debug.js
│
├─requirejs
│      css.js
│      css.min.js
│      require.debug.js
│      require.js
│      text.js
│      text.min.js
│      u.js
│
├─tree
│  └─3.0.1
│      ├─css
│      │      grid.min.css
│      │      tree.css
│      │
│      └─js
│              tree.js
│              tree.min.js
│              u-tree.js
│              u-tree.min.js
│
├─underscore
│      underscore.js
│
└─uui
    └─3.0.1
        ├─css
        │      font-awesome.css
        │      grid.css
        │      grid.min.css
        │      tree.css
        │      u-extend.css
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
                u-model.js
                u-polyfill.js
                u-polyfill.min.js
                u-tree.js
                u-tree.min.js
                u-ui.js
                u-ui.min.js
                u.js
                u.min.js


```
