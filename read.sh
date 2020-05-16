#!/bin/bash

TARGET_TRANSACTIONS=4000
BLOCK_SIZE=20

date

for ((i = 0; i < TARGET_TRANSACTIONS / BLOCK_SIZE; i++)); do

  for ((thread = 0; thread < BLOCK_SIZE; thread += 4)); do
    # args: [user, identity, start_date]
    node queryConsent.js user1 &
    pids[${thread}]=$!
    node queryConsent.js user2 &
    pids[$((thread + 1))]=$!
    node queryConsent.js user3 &
    pids[$((thread + 2))]=$!
    node queryConsent.js user4 &
    pids[$((thread + 3))]=$!
  done

  # wait for all pids
  for pid in ${pids[*]}; do
    wait $pid
  done

done

date
