#!/bin/sh

cdir=`pwd`

prodName=(
  "neoui"
  "kero"
  "neoui-datetimepicker"
  "neoui-tree"
  "neoui-grid"
)


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
