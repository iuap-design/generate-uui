#!/bin/sh

cdir=`pwd`

codeDirs=(
  "git@github.com:iuap-design/iuap-design.git"
  "git@github.com:iuap-design/datatable.git"
  "git@github.com:iuap-design/datetimepicker.git"
  "git@github.com:iuap-design/tree.git"
  "git@github.com:iuap-design/grid.git"
)

prodName=(
  "iuap-design"
  "datatable"
  "datetimepicker"
  "tree"
  "grid"
)

# 检查项目目录是否
Checkdir(){
  if [ ! -d $1 ]
  then
    mkdir -p $1
  fi
}

# 代码下载
for dir in ${codeDirs[@]}
do
  prodDir="$cdir/$name"

  if [ ! -d $prodDir ]
  then
    git clone ${dir}
  	echo "--- ${dir}项目代码下载完成 ---"
  fi
done

# 项目分支切换
for name in ${prodName[@]}
do
	cd ${name}
  git checkout release
  cd ..
  echo "--- ${name}已经切换到releas分支 ---"
done
