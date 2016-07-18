#!/bin/sh

cdir=`pwd`

prodName=(
  "neoui"
  "kero"
  "neoui-datetimepicker"
  "neoui-tree"
  "neoui-grid"
)


# 拉取代码 release
for name in ${prodName[@]}
do
  cd ${name}
  echo "--- ${name}进行代码更新 ---"
  git pull origin release
  cd ..
  echo "--- 代码更新完成 ---"
done
