#!/bin/bash

cdir=`pwd`

# 安装依赖包 && 最新kero-adapter包
modulePre="$cdir/node_modules/"
moduleName="kero-adapter"
modulePath="${modulePre}${moduleName}"

if [ -d "$modulePre" ]
then
    if [ -d $modulePath ]
    then
      echo "卸载旧版$moduleName"
      npm uninstall $moduleName
      echo "安装新版$moduleName"
      npm install $moduleName
      echo "已安装成功新版$moduleName"
    else
      echo "安装新版$moduleName"
      npm install $moduleName
      echo "已安装成功新版$moduleName"
    fi
else
    npm install
fi
