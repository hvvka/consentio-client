#!/bin/bash

TARGET_KEY_SPACE = 20_000;

for i in {1..25}
do
  node updateConsent.js user1 &
  node updateConsent.js user2 &
  node updateConsent.js user3 &
  node updateConsent.js user4 &
done
