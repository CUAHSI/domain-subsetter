#!/usr/bin/env bash

for f in *.md; do
    echo converting $f
    pandoc -f markdown -t html $f > ../"${f%.*}.html"
done

