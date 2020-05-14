'use strict';

const {FileSystemWallet, Gateway} = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        const ccpPath = path.resolve(__dirname, 'connection.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.resolve(__dirname, 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        const gateway = new Gateway();
        await gateway.connect(ccp, {wallet, identity: 'user1', discovery: {enabled: true, asLocalhost: false}});

        const network = await gateway.getNetwork('channel1');
        const contract = network.getContract('consentio');
        await contract.submitTransaction("updateConsent",
            "-1", "g", "all", "-2", "20160101", "101", "hippa"
        );
        // updateConsent(contract);
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

const targetKeySpace = 20_000;
const valuesPerKey = 1;

function updateConsent(contract) {
    // const stream = fs.createWriteStream(`./output/figure7/${targetKeySpace}.csv`, {flags: 'a'});
    for (let startDate = 0; startDate < targetKeySpace; startDate++) {
        // const t0 = new Date().getTime();
        // patient_id, action, role_id, start_date, end_date, arr[column ids], watchdog_id
        // TODO: inner loop for valuesPerKey
        // for (let patientId = 0; patientId < valuesPerKey; valuesPerKey++)
        contract.submitTransaction("updateConsent",
            "0", "g", "all", startDate.toString(), "20160101", "101", "hippa"
        );
        // const t1 = new Date().getTime();
        // console.log(`Transaction has been submitted. ${response.toString('utf8')}`);
        // console.log("Execution time: " + (t1 - t0) + " ms");
        // stream.write((t1 - t0) + "\n");
    }
    // stream.end();
    // return response;
}

const args = process.argv.slice(2);
console.log('args: ', args);


// const t0 = new Date().getTime();
// main();
// const t1 = new Date().getTime();
// console.log("Execution time: " + (t1 - t0) + " ms");

