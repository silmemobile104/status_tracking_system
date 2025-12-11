const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const createAdmin = async () => {
    await connectDB();

    const username = 'admin';
    const password = 'password123';
    let user = await User.findOne({ username });

    if (user) {
        console.log('Admin user already exists');
        process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
        username,
        password: hashedPassword,
        name: 'Admin User',
        companyId: 'company_1_id',
        role: 'admin',
        department: 'Management',
        branch: 'Headquarters'
    });

    await user.save();
    console.log('Admin user created');
    process.exit(0);
};

createAdmin();
