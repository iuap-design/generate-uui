#!/bin/sh

cdir=`pwd`

prodName=(
  "neoui"
  "kero"
  "neoui-datetimepicker"
  "neoui-tree"
  "neoui-grid"
)



# 执行gulp
for name in ${prodName[@]}
do
  cd ${name}
  echo "--- ${name}执行gulp ---"
  gulp dist
  cd ..
  echo "--- 执行gulp完成 ---"
done

gulp dist
