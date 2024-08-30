require('dotenv').config();

const axios = require('axios');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.send('Hello, HTTPS!');
});

// The ACH request body without line items
const ACHTestTemplate = {
    "name": "First Last",
    "aba": "011000015",  // The ABA number used in the successful curl request
    "dda": "1029384756",
    "accountType": "C",
    "locationId": "5047323",
    "amount": "123.45",
    "depositName": "name of deposit",
    "creditOrDebit": "C",
    "entryClassCode": "CCD",
    "checkSerialNumber": null,
    "addenda": "this is the addenda",
    "traceNumber": "1",
    "discretionaryData": "S",
    "companyDescription": "name of company",
    "terminalCity": "Los Angeles",
    "terminalState": "CA",
    "effectiveDate": "2024-09-01",
    "accountValidation": "Y"
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
    console.log(`HTTP Server running on http://localhost:${PORT}`);
});
