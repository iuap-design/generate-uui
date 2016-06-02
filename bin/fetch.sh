#!/bin/sh

cdir=`pwd`

codeDirs=(
  "git@github.com:iuap-design/iuap-design.git"
  "git@github.com:iuap-design/datatable.git"
  "git@github.com:iuap-design/datetimepicker.git"
  "git@github.com:iuap-design/tree.git"
  "git@github.com:iuap-design/grid.git"
)

prodName=("iuap-design" "datatable" "datetimepicker" "tree" "grid")

for dir in ${codeDirs[@]}
do
	git clone ${dir}
	echo "${dir}项目代码下载完成~~!"
done

for name in ${prodName}
do
	cd ${name}
  git checkout release
  cd ..
  echo "${name}已经切换到releas分支"
done
