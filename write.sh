#!/bin/bash

# Runs WRITE action (updateConsent) on the whole world state
# adding 4000 key for the given individual id

# world state key space (transactions) = 4000
# keys per transaction = 1
# values space per key = 1
# block size = 20
# total added blocks = 200
# 20 threads; 5 threads for each client

TARGET_KEY_SPACE=4000
BLOCK_SIZE=20
UPDATED_ID=$1

echo "START $(date +%FT%T)"

for ((i = 0; i < TARGET_KEY_SPACE / BLOCK_SIZE; i++)); do

  for ((thread = 0; thread < BLOCK_SIZE; thread += 4)); do
    # args: [user, identity, start_date]
    node updateConsent.js user1 "$UPDATED_ID" $((i * BLOCK_SIZE + thread)) &
    pids[${thread}]=$!
    node updateConsent.js user2 "$UPDATED_ID" $((i * BLOCK_SIZE + thread + 1)) &
    pids[$((thread + 1))]=$!
    node updateConsent.js user3 "$UPDATED_ID" $((i * BLOCK_SIZE + thread + 2)) &
    pids[$((thread + 2))]=$!
    node updateConsent.js user4 "$UPDATED_ID" $((i * BLOCK_SIZE + thread + 3)) &
    pids[$((thread + 3))]=$!
  done

#  echo $i
  # wait for all pids
  for pid in ${pids[*]}; do
    wait $pid
  done

done

echo "END $(date +%FT%T)"
