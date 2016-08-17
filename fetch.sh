#!/bin/sh

cdir=`pwd`

prodName=(
  "neoui-tree"
  "neoui-grid"
)

# 安装依赖包 && 最新kero-adapter包
moduleDir="$cdir/node_modules/"
echo "$moduleDir"

keroDir="$cdir/node_modules/kero-adapter"
echo "$keroDir"

if [ -d "$moduleDir" ]
  then
    if [ -d "$keroDir" ]
      then
        echo "卸载旧版kero-adapter"
        cnpm uninstall kero-adapter
        echo "安装新版kero-adapter"
        cnpm install kero-adapter
        echo "kero-adapter已安装"
    else
        echo "正在安装kero-adapter"
        cnpm install kero-adapter
        echo "kero-adapter已安装"
    fi
else
    cnpm install
fi


# 更新下载
# for name in ${prodName[@]}
# do
#   prodDir="$cdir/$name"
#   remoteDir="git@github.com:iuap-design/${name}.git"

#   if [ ! -d $prodDir ]
#   then
#     echo "--- 开始下载${name} ---"
#     git clone ${remoteDir}
#   	echo "--- ${name}下载完成~~! ---"
#   fi
# done

# 分支切换到 release
# for name in ${prodName[@]}
# do
# 	cd ${name}
#   echo "--- ${name}进行分支切换和代码更新 ---"
#   git checkout release
#   git pull origin release
#   cd ..
#   echo "--- 分支切换和代码更新完成 ---"
# done
