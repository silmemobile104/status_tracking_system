// models/deposit.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepositSchema = new Schema({
    companyId: { type: String, required: true },
    branch: { type: String, default: '' }, // เก็บสาขา
    
    // --- ฝั่งซ้าย: ข้อมูลมัดจำ ---
    depositDate: { type: Date, default: Date.now },
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    depositAmount: { type: Number, required: true },
    pickupDueDate: { type: Date },

    // --- ฝั่งขวา: รับเครื่องแล้ว ---
    billNo: { type: String, default: '' },
    imei: { type: String, default: '' },
    product: { type: String, default: '' }, // สินค้า
    price: { type: Number, default: 0 },    // ราคาเครื่อง
    // *ส่วนต่าง (Balance) จะคำนวณเอาหน้าบ้าน (Price - Deposit)*
    
    isSuccess: { type: Boolean, default: false }, // สถานะสำเร็จ
    signName: { type: String, default: '' },      // ลงชื่อพนักงาน
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Deposit', DepositSchema);