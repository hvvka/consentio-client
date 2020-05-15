#!/bin/bash

TARGET_KEY_SPACE=20000;

for (( i=0; i<TARGET_KEY_SPACE/100; i++ ))
do

  for (( thread=0; thread<100; thread+=4 )); do
    # args: [user, identity, start_date]
    node updateConsent.js user1 0 $(( i*100 + thread )) &
    pids[${thread}]=$!
    node updateConsent.js user2 0 $(( i*100 + thread + 1 )) &
    pids[$(( thread + 1 ))]=$!
    node updateConsent.js user3 0 $(( i*100 + thread + 2 )) &
    pids[$(( thread + 2 ))]=$!
    node updateConsent.js user4 0 $(( i*100 + thread + 3 )) &
    pids[$(( thread + 3 ))]=$!
done

  # wait for all pids
  for pid in ${pids[*]}; do
      wait $pid
  done

done
