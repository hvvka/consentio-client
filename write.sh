#!/bin/bash

TARGET_KEY_SPACE=1000
BLOCK_SIZE=20

for ((i = 0; i < TARGET_KEY_SPACE / BLOCK_SIZE; i++)); do

  for ((thread = 0; thread < BLOCK_SIZE; thread += 4)); do
    # args: [user, identity, start_date]
    node updateConsent.js user1 0 $((i * BLOCK_SIZE + thread)) &
    pids[${thread}]=$!
    node updateConsent.js user2 0 $((i * BLOCK_SIZE + thread + 1)) &
    pids[$((thread + 1))]=$!
    node updateConsent.js user3 0 $((i * BLOCK_SIZE + thread + 2)) &
    pids[$((thread + 2))]=$!
    node updateConsent.js user4 0 $((i * BLOCK_SIZE + thread + 3)) &
    pids[$((thread + 3))]=$!
  done

  # wait for all pids
  for pid in ${pids[*]}; do
    wait $pid
  done

done

#key space = 1 000
#block size = 20
#blocks to add = 50
#20 threads; 5 threads each
