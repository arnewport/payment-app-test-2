// Load environment variables
require('dotenv').config();

// Imports
const axios = require('axios');
const express = require('express');
const path = require('path');
const fs = require('fs');
const Client = require('ssh2-sftp-client');

// Create an instance of the SFTP client
const sftp = new Client();

// Create an Express app
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Basic GET route
app.get('/', (req, res) => {
    res.send('Hello, HTTPS!');
});

// SFTP connection details
const sftpConfig = {
    host: 'ftp.isfs.io', // Replace with your SFTP host
    port: '22', // Default SFTP port
    username: 'letpam', // Replace with your SFTP username
    privateKey: fs.readFileSync(path.join(process.env.USERPROFILE, '.ssh', 'id_rsa')) // Path to your private key
};

// New route to trigger SFTP file download
app.get('/download-files', async (req, res) => {
    try {
        // Connect to SFTP
        await sftp.connect(sftpConfig);

        // Specify remote directory and local directory
        const remoteDir = '/io.isfs.ftp.prod/letpam/outbound/test'; // Full path to inbound directory
        const localDir = path.join(process.env.USERPROFILE, 'Downloads'); // Save files to your Downloads folder

        // Ensure the local directory exists
        if (!fs.existsSync(localDir)) {
            fs.mkdirSync(localDir);
        }

        // List files in the remote directory
        const fileList = await sftp.list(remoteDir);
        console.log('Files available for download:', fileList);

        // Download each file
        for (const file of fileList) {
            const remoteFilePath = `${remoteDir}/${file.name}`;
            const localFilePath = path.join(localDir, file.name);

            console.log(`Downloading ${file.name}...`);
            await sftp.fastGet(remoteFilePath, localFilePath);
            console.log(`File downloaded: ${localFilePath}`);
        }

        // Disconnect from SFTP
        await sftp.end();

        // Respond to the client
        res.send('Files downloaded successfully.');
    } catch (err) {
        console.error('Error downloading files:', err.message);
        res.status(500).send('Error downloading files');
    }
});

const ACHTestTemplate = {
    "name": "First Last",
    "aba": "011000015",
    "dda": "1029384756",
    "accountType": "C",
    "locationId": "5047323",
    "amount": "3.00",
    "depositName": "name of deposit",
    "creditOrDebit": "D",
    "entryClassCode": "CCD",
    "checkSerialNumber": null,
    "addenda": "this is the addenda",
    "traceNumber": "1",
    "discretionaryData": "S",
    "companyDescription": "name of company",
    "terminalCity": "Los Angeles",
    "terminalState": "CA",
    "effectiveDate": "2024-09-12",
    "accountValidation": "N"
};

// Example of adding Basic Authentication
const username = process.env.ISTREAM_USERNAME;
const password = process.env.ISTREAM_PASSWORD;
const authHeader = 'Basic dGVzdGxldHBhbWluYzp3SHZ2enQ9WXY2Q2lucg=='; // TODO: replace hardcoded value with calculated value

app.get('/sendACH', async (req, res) => {
    try {
        const response = await axios.post('https://www.istreamdeposit.com/tlsrest/sendDetailedACH', ACHTestTemplate, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': authHeader
            }
        });
        console.log(response.data);
        res.send('ACH Request sent! Response: ' + JSON.stringify(response.data));
    } catch (error) {
        console.error('Error making the request:', error);
        res.status(500).send('Error making the ACH request');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
