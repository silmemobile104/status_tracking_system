// controllers/depositController.js
const Deposit = require('../models/deposit');

// @desc    ดึงข้อมูล (แยกตามสาขาของ Staff)
exports.getDeposits = async (req, res) => {
    try {
        const userRole = req.user.role;
        let query = { companyId: req.user.companyId };

        // ถ้าเป็น Staff เห็นแค่สาขาตัวเอง
        if (userRole === 'staff') {
            query.branch = req.user.branch;
        }
        
        // เรียงวันที่ล่าสุดขึ้นก่อน
        const deposits = await Deposit.find(query).sort({ depositDate: -1 });
        res.status(200).json(deposits);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    บันทึก หรือ แก้ไข ข้อมูล
exports.saveDeposit = async (req, res) => {
    try {
        const { 
            id, // ถ้าส่ง id มา = แก้ไข
            depositDate, customerName, phoneNumber, depositAmount, pickupDueDate,
            billNo, imei, product, price, isSuccess 
        } = req.body;

        if (id) {
            // --- แก้ไข ---
            const deposit = await Deposit.findById(id);
            if (!deposit) return res.status(404).json({ message: 'Not Found' });

            deposit.depositDate = depositDate;
            deposit.customerName = customerName;
            deposit.phoneNumber = phoneNumber;
            deposit.depositAmount = depositAmount;
            deposit.pickupDueDate = pickupDueDate;
            
            deposit.billNo = billNo;
            deposit.imei = imei;
            deposit.product = product;
            deposit.price = price;
            deposit.isSuccess = isSuccess;
            // (ถ้าสำเร็จ ให้ลงชื่อคนกดอัปเดตล่าสุด)
            if (isSuccess && !deposit.signName) deposit.signName = req.user.name;

            await deposit.save();
            return res.status(200).json(deposit);
        } else {
            // --- สร้างใหม่ ---
            const newDeposit = new Deposit({
                companyId: req.user.companyId,
                branch: req.user.branch || req.user.department,
                depositDate, customerName, phoneNumber, depositAmount, pickupDueDate,
                billNo, imei, product, price, isSuccess, 
                signName: '' // สร้างใหม่ยังไม่ลงชื่อรับของ
            });
            await newDeposit.save();
            return res.status(201).json(newDeposit);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    ลบรายการ
exports.deleteDeposit = async (req, res) => {
    try {
        await Deposit.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};