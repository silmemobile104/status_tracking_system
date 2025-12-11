const mongoose = require('mongoose');
const User = require('./models/user');
const ImportRequest = require('./models/importRequest');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/status_tracking_db');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Connection Error:', err);
        process.exit(1);
    }
};

const inspectData = async () => {
    await connectDB();

    console.log('\n--- USERS ---');
    const users = await User.find({});
    users.forEach(u => {
        console.log(`User: ${u.username} (${u.role}) - Company: ${u.companyId} - Branch: ${u.branch}`);
    });

    console.log('\n--- IMPORT REQUESTS ---');
    const imports = await ImportRequest.find({});
    if (imports.length === 0) console.log('No import requests found.');
    imports.forEach(i => {
        console.log(`Import: ${i._id} - Type: ${i.type} - Status: ${i.status} - Company: ${i.companyId} - Branch: ${i.branch} - Details:`, i.details);
    });

    process.exit();
};

inspectData();
