const mongoose = require('mongoose');
const ImportRequest = require('./models/importRequest');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected");

        const details = {
            supplier: "Test Supplier",
            billName: "Test Bill",
            items: [
                { productName: "Item 1", quantity: 10, note: "Note 1" },
                { productName: "Item 2", quantity: 5, note: "Note 2" }
            ]
        };

        const newImport = new ImportRequest({
            type: 'accessory',
            branch: 'TEST',
            companyId: 'test_company',
            createdBy: new mongoose.Types.ObjectId(),
            details: details
        });

        const saved = await newImport.save();
        const fs = require('fs');
        fs.writeFileSync('test_schema_output.json', JSON.stringify(saved, null, 2));
        console.log("Written to test_schema_output.json");

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
