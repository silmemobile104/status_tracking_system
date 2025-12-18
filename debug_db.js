const mongoose = require('mongoose');
const ImportRequest = require('./models/importRequest');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const latestImports = await ImportRequest.find({ type: 'accessory' })
            .sort({ createdAt: -1 })
            .limit(3);

        const fs = require('fs');
        fs.writeFileSync('debug_output.json', JSON.stringify(latestImports, null, 2));
        console.log("Written to debug_output.json");

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
