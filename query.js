'use strict';

const {Gateway, FileSystemWallet, DefaultQueryHandlerStrategies} = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {

        const ccpPath = path.resolve(__dirname, 'connection.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.resolve(__dirname, 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        const gateway = new Gateway();
        const connectOptions = {
            queryHandlerOptions: {
                strategy: DefaultQueryHandlerStrategies.MSPID_SCOPE_SINGLE
            }
        };
        await gateway.connect(ccp, {
            wallet,
            identity: 'user1',
            discovery: {enabled: true, asLocalhost: false}, ...connectOptions
        });
        const network = await gateway.getNetwork('channel1');

        const contract = network.getContract('consentio');
        // const response = await contract.evaluateTransaction("queryConsent", "{\"selector\":{}, \"use_index\":[\"_design/indexConsentDoc\", \"indexConsent\"]}");
        const response = await contract.evaluateTransaction("accessConsent", "all", "20150101", "20160101", "101", "hippa", "dc1");

        console.log(response.toString('utf8'));

        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to query chaincode: ${error}`);
        process.exit(1);
    }
}

main();

