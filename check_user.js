const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

mongoose.connect('mongodb://127.0.0.1:27017/status_tracking_db')
    .then(async () => {
        const user = await User.findOne({ username: 'SM0007' });
        if (user) {
            console.log('User Found:', user.username);
            console.log('Role:', user.role);
            console.log('Department:', user.department);
            console.log('Company:', user.companyId);
        } else {
            console.log('User SM0007 not found.');
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
