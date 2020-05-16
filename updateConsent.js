'use strict';

const {FileSystemWallet, Gateway} = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main(args) {
    try {
        const ccpPath = path.resolve(__dirname, 'connection.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.resolve(__dirname, 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        const gateway = new Gateway();
        await gateway.connect(ccp, {wallet, identity: args[0], discovery: {enabled: true, asLocalhost: false}});

        const network = await gateway.getNetwork('channel2');
        const contract = network.getContract('consentio');

        await contract.submitTransaction("updateConsent",
            args[1], "g", "all", args[2], "20160101", "101", "hippa"
        );

        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}


// args: [user, identity, start_date]

// const t0 = new Date().getTime();
main(process.argv.slice(2));
// const t1 = new Date().getTime();
// console.log("Execution time: " + (t1 - t0) + " ms");

