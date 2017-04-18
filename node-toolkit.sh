#!/usr/bin/env bash
clear
cd nodejs/       # in right location...
node cli.js "$@" # calling node toolkit
exit $?          # returning last received exit status
