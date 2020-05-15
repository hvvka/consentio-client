# consentio-client

Client application for experiments reproduction using Node.js Fabric SDK.
It connects to [IBM Blockchain Platform network](https://cloud.ibm.com/docs/blockchain?topic=blockchain-ibp-console-app).

## Run

[enrollUser.js](./enrollUser.js)
```bash
hg@hvvka ~/p/_/m/consentio-client> node enrollUser.js                                                                                                                                     1 master!?
Wallet path: /Users/hg/pwr/_w8/mgr/consentio-client/wallet
Successfully enrolled client "user1" and imported it into the wallet
```

[updateConsent.js](updateConsent.js)
```js
await contract.submitTransaction("updateConsent", "2", "g", "all", "20150101", "20160101", "101", "hippa");
```

```bash
hg@hvvka ~/p/_/m/consentio-client> node updateConsent.js                                                                                                                                          1 master!
Transaction has been submitted.
```

[queryConsent.js](queryConsent.js)
```js
await contract.evaluateTransaction("queryConsent", "{\"selector\":{}, \"use_index\":[\"_design/indexConsentDoc\", \"indexConsent\"]}");
```

```bash
hg@hvvka ~/p/_/m/consentio-client> node queryConsent.js                                                                                                                                             master!
[{"Key":"101all2015010120160101hippa", "Record":{"u_ids":{"2":1}}}]
```

## Consentio chaincode

### World state design

```json
{ 
  resource_id|watchdog_id|role_id|time_id : [ind_id_1,..., ind_id_n]
}
```

value = a list of individual IDs giving consent to the data specified in the key (i.e., the given temporal fragment of a the given resource being available to the given role approved by the given watchdog)

### Operations

- updateRole (watchdog_id, role_id, data_consumer_id, action)

    ```bash
    peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n CHAINCODE_NAME -c \
        '{"Args":["updateRole", "hippa", "all", "dc1", "r"]}'
    ```
  
    action: `r` (revoke) or `g` (grant)

- queryConsent (query_string)

    ```bash
    peer chaincode query -C $CHANNEL_NAME -n CHAINCODE_NAME -c \
        '{"Args":["queryConsent", "{\"selector\":{}, \"use_index\":[\"_design/indexConsentDoc\", \"indexConsent\"]}"]}'
    ```

- updateConsent (patient_id, action, role_id, start_date, end_date, arr[column ids], watchdog_id)

    ```bash
    peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n CHAINCODE_NAME -c \
        '{"Args":["updateConsent", "2", "g", "all", "20150101", "20160101", "101", "hippa"]}'
    ```

- accessConsent (role_id, start_date, end_date, column_ids, watchdog_id, data_consumer_id)

    ```bash
    peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n CHAINCODE_NAME -c \
        '{"Args":["accessConsent", "all", "20150101", "20160101", "101", "hippa", "dc1"]}'
    ```

- initialize (column_id, action, role_id, start_date, end_date, arr[patient ids], watchdog_id)

## Reproduction

1. With [enrollUser.js](./enrollUser.js) enroll 4 users: `user1`, `user2`, `user3`, `user4`.

2. 
