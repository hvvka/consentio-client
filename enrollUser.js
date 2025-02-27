'use strict';

const FabricCAServices = require('fabric-ca-client');
const {FileSystemWallet, X509WalletMixin} = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function main(args) {
    try {

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['173.193.106.227:30233'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const userExists = await wallet.exists(args[0]);
        if (userExists) {
            console.log(`An identity for "${args[0]}" already exists in the wallet`);
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({enrollmentID: 'application', enrollmentSecret: 'applicationpw'});
        const identity = X509WalletMixin.createIdentity('org1msp', enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(args[0], identity);
        console.log(`Successfully enrolled client "${args[0]}" and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to enroll "${args[0]}": ${error}`);
        process.exit(1);
    }
}

// args: [user]
main(process.argv.slice(2));
