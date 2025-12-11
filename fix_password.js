const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/status_tracking_db')
    .then(async () => {
        console.log('Connected.');
        const admin = await User.findOne({ username: 'admin' });
        if (admin) {
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash('password123', salt);
            await admin.save();
            console.log('Admin password updated to hash.');
        } else {
            console.log('Admin not found.');
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
