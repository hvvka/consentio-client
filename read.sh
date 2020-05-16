#!/bin/bash

TARGET_TRANSACTIONS=100000

for ((i = 0; i < TARGET_TRANSACTIONS / 100; i++)); do

  for ((thread = 0; thread < 100; thread += 4)); do
    # args: [user, identity, start_date]
    node queryConsent.js user1 0 $((i * 100 + thread)) &
    pids[${thread}]=$!
    node queryConsent.js user2 0 $((i * 100 + thread + 1)) &
    pids[$((thread + 1))]=$!
    node queryConsent.js user3 0 $((i * 100 + thread + 2)) &
    pids[$((thread + 2))]=$!
    node queryConsent.js user4 0 $((i * 100 + thread + 3)) &
    pids[$((thread + 3))]=$!
  done

  # wait for all pids
  for pid in ${pids[*]}; do
    wait $pid
  done

done
