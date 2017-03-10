#!/bin/bash
#
# vim: sts=4 sw=4 et ai si

set -o xtrace

PROG=${BASH_SOURCE[0]:-$0}

if [ $# -lt 2 ]; then
	echo "Usage: $PROG <basedir> <source>"
	exit 255
fi

BASE_DIR=$(cd "$1"; pwd)

echo "BASE_DIR: $BASE_DIR"
echo "SOURCE: $SOURCE"

cd "${BASE_DIR}"
        
git remote update
git push --mirror "$2"

cd -
cd -
