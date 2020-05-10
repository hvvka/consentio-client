# consentio-client

Client application for experiments reproduction using Node.js Fabric SDK.

https://cloud.ibm.com/docs/blockchain?topic=blockchain-ibp-console-app#ibp-console-app-enroll

## Run

[enrollUser.js](./enrollUser.js)
```bash
hg@hvvka ~/p/_/m/consentio-client> node enrollUser.js                                                                                                                                     1 master!?
Wallet path: /Users/hg/pwr/_w8/mgr/consentio-client/wallet
Successfully enrolled client "user1" and imported it into the wallet
```

[invoke.js](./invoke.js)
```bash
hg@hvvka ~/p/_/m/consentio-client> node invoke.js                                                                                                                                           master!+
2020-05-09T21:45:46.193Z - warn: [DiscoveryEndorsementHandler]: _build_endorse_group_member >> G0:0 - endorsement failed - Error: Watchdog has not approved role given for the data consumer
2020-05-09T21:45:46.195Z - error: [DiscoveryEndorsementHandler]: _endorse - endorsement failed::Error: Endorsement has failed
    at DiscoveryEndorsementHandler._endorse (/Users/hg/pwr/_w8/mgr/consentio-client/node_modules/fabric-client/lib/impl/DiscoveryEndorsementHandler.js:185:19)
    at async Channel.sendTransactionProposal (/Users/hg/pwr/_w8/mgr/consentio-client/node_modules/fabric-client/lib/Channel.js:2801:22)
    at async Transaction.submit (/Users/hg/pwr/_w8/mgr/consentio-client/node_modules/fabric-network/lib/transaction.js:183:19)
    at async main (/Users/hg/pwr/_w8/mgr/consentio-client/invoke.js:43:9)
Failed to submit transaction: Error: Endorsement has failed
```

[query.js](./query.js)
```bash

```
