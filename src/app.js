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

const ACHRequestTemplate = {
        "name": "string",
        "aba": "string",
        "dda": "string",
        "accountType": "C",
        "locationId": "string",
        "amount": "string",
        "depositName": "string",
        "creditOrDebit": "C",
        "entryClassCode": "CCD",
        "checkSerialNumber": "string",
        "addenda": "string",
        "traceNumber": "string",
        "discretionaryData": "S",
        "companyDescription": "string",
        "terminalCity": "string",
        "terminalState": "string",
        "effectiveDate": "string",
        "accountValidation": "Y",
        "lineItem": [
        {
            "amount": 0,
            "auxFields": [
                {
                    "auxFieldName": "string",
                    "auxFieldValue": "string"
                }
            ]
        }
    ]
}

const ACHTestTemplate = {
    "name": "First Last",
    "aba": "192837465",
    "dda": "1029384756",
    "accountType": "C",
    "locationId": "123",
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
    "accountValidation": "Y",
    "lineItem": [
        {
            "amount": 123.45,
            "auxFields": [
                {
                    "auxFieldName": "name",
                    "auxFieldValue": "value"
                }
            ]
        }
    ]
}

// // Add a route to trigger the ACH request
// app.post('/sendACH', async (req, res) => {
//     try {
//         const response = await axios.post('https://www.istreamdeposit.com/tlsrest/sendDetailedACH', ACHTestTemplate, {
//             headers: {
//                 'accept': 'application/json',
//                 'Content-Type': 'application/json'
//             }
//         });
//         // Print the response to the console
//         console.log(response.data);
//         // Send a response back to the client
//         res.send('ACH Request sent! Response: ' + JSON.stringify(response.data));
//     } catch (error) {
//         // Handle errors and print them to the console
//         console.error('Error making the request:', error);
//         res.status(500).send('Error making the ACH request');
//     }
// });

app.get('/sendACH', async (req, res) => {
    try {
        const response = await axios.post('https://www.istreamdeposit.com/tlsrest/sendDetailedACH', ACHTestTemplate, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        // Print the response to the console
        console.log(response.data);
        // Send a response back to the client
        res.send('ACH Request sent! Response: ' + JSON.stringify(response.data));
    } catch (error) {
        // Handle errors and print them to the console
        console.error('Error making the request:', error);
        res.status(500).send('Error making the ACH request');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`HTTP Server running on http://localhost:${PORT}`);
});
