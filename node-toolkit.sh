#!/usr/bin/env bash
CURRENT="$PWD"
clear
cd nodejs/       # in right location...
node cli.js "$CURRENT" "$@" # calling node toolkit
exit $?          # returning last received exit status
