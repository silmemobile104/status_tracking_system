const mongoose = require('mongoose');
const ImportRequest = require('./models/importRequest'); // Adjust path as necessary
require('dotenv').config();

mongoose.connect('mongodb://127.0.0.1:27017/status_tracking_db')
    .then(async () => {
        console.log('Connected to DB');

        // Find all imports and log specific fields
        const imports = await ImportRequest.find({}, 'type details branch createdAt');

        console.log(`Found ${imports.length} import requests:`);
        imports.forEach(i => {
            console.log(`- Type: [${i.type}] | Branch: ${i.branch} | Date: ${i.createdAt}`);
            if (i.details) console.log(`  Details:`, i.details);
        });

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
