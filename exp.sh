#!/bin/bash

FROM=${1:3}
TO=${2:10}
LOG_FILE=read_write.log

touch $LOG_FILE

{
  for ((i = FROM; i < TO; i++)); do
    echo "WRITE ${i} values"
    ./write.sh $((i - 1))
    echo "READ ${i} values"
    ./read.sh
  done
} >> $LOG_FILE
