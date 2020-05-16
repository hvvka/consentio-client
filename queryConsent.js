'use strict';

const {Gateway, FileSystemWallet, DefaultQueryHandlerStrategies} = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main(args) {
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
            identity: args[0],
            discovery: {enabled: true, asLocalhost: false}, ...connectOptions
        });
        const network = await gateway.getNetwork('channel2');

        const contract = network.getContract('consentio');
        // const t0 = new Date().getTime();
        await queryConsent(contract);
        // const t1 = new Date().getTime();
        // console.log(response.toString('utf8'));
        // console.log("Execution time: " + (t1 - t0) + " ms");

        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to query chaincode: ${error}`);
        process.exit(1);
    }
}

async function queryConsent(contract) {
    return contract.evaluateTransaction("queryConsent",
        "{\n" +
        "   \"selector\": {},\n" +
        "   \"limit\": 100,\n" +
        "   \"use_index\": [\"_design/indexConsentDoc\", \"indexConsent\"]}" +
        "}");
}

// args: [user]
main(process.argv.slice(2));
