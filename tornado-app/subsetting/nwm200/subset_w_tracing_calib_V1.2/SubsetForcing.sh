#!/bin/bash

oldPath=$1
newPath=$2
geo_w=$3
geo_e=$4
geo_s=$5
geo_n=$6

lsDiff=$(diff <(ls $oldPath) <(ls $newPath))
lsDiffBNotA=$(echo "$lsDiff" | egrep '^<' | tr -d '<' | tr -d ' ' )

for file in $lsDiffBNotA ; do 
    echo $file
    ncks -O -d west_east,$(($geo_w-1)),$(($geo_e-1)) -d south_north,$(($geo_s-1)),$(($geo_n-1)) ${oldPath}/${file##*/} ${newPath}/${file##*/}
done 

exit

