const mongoose = require('mongoose');
const User = require('./models/user');
const ImportRequest = require('./models/importRequest');
// Load dotenv to ensure URI is correct if used, though local string is safer for now
require('dotenv').config();

console.log('Connecting to DB...');
mongoose.connect('mongodb://127.0.0.1:27017/status_tracking_db', { serverSelectionTimeoutMS: 5000 })
    .then(async () => {
        console.log('CONNECTED');

        const admin = await User.findOne({ username: 'admin' });
        console.log('Admin User:', admin ? `${admin.username} (Company: ${admin.companyId}, Role: ${admin.role})` : 'Not Found');

        const imports = await ImportRequest.find({});
        console.log('Total Imports:', imports.length);
        imports.forEach(i => {
            console.log(`Import: ${i._id} | Status: ${i.status} | Company: ${i.companyId} | Type: ${i.type} | Branch: ${i.branch}`);
        });

        process.exit(0);
    })
    .catch(err => {
        console.error('CONNECT ERROR:', err);
        process.exit(1);
    });
