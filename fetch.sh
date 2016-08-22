#!/bin/sh

cdir=`pwd`

prodName=(
  "neoui-tree"
  "neoui-grid"
)

# 安装依赖包 && 最新kero-adapter包
modulePre="$cdir/node_modules/"
moduleName=(
  "kero-adapter"
  "neoui-polyfill"
  )

if [ -d "$modulePre" ]
then
  for name in ${moduleName[@]}
  do
    modulePath="${modulePre}${name}"
    if [ -d $modulePath ]
    then
      echo "卸载旧版$name"
      npm uninstall $name
      echo "安装新版$name"
      npm install $name
      echo "已安装成功新版$name"
    else
      echo "安装新版$name"
      npm install $name
      echo "已安装成功新版$name"
    fi
  done
else
    npm install
fi

# 更新下载
for name in ${prodName[@]}
do
  prodDir="$cdir/$name"
  remoteDir="git@github.com:iuap-design/${name}.git"

  if [ ! -d $prodDir ]
  then
    echo "--- 开始下载${name} ---"
    git clone ${remoteDir}
  	echo "--- ${name}下载完成~~! ---"
  fi
done

# 分支切换到 release
for name in ${prodName[@]}
do
	cd ${name}
  echo "--- ${name}进行分支切换和代码更新 ---"
  git checkout release
  git pull origin release
  cd ..
  echo "--- 分支切换和代码更新完成 ---"
done
