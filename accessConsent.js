'use strict';

const {FileSystemWallet, Gateway} = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function invoke(submitTransaction) {
    try {
        const ccpPath = path.resolve(__dirname, 'connection.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.resolve(__dirname, 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        const gateway = new Gateway();
        await gateway.connect(ccp, {wallet, identity: 'user1', discovery: {enabled: true, asLocalhost: false}});

        const network = await gateway.getNetwork('channel1');
        const contract = network.getContract('consentio');

        const response = submitTransaction(contract);
        console.log(`Transaction has been submitted. ${response.toString('utf8')}`);

        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

const accessConsent = async contract => {
    return contract.submitTransaction("accessConsent",
        "all", "20150101", "20160101", "101", "hippa", "dc1"
    );
};

invoke(accessConsent);
