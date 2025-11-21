// controllers/depositController.js
const Deposit = require('../models/deposit');

// @desc    ดึงข้อมูล (รองรับการกรอง Branch และ Company)
exports.getDeposits = async (req, res) => {
    try {
        const userRole = req.user.role;
        // 1. รับค่าที่ส่งมาจากหน้าเว็บ (Query Parameters)
        const { branch, companyId } = req.query; 

        // 2. กำหนด Company ID ที่จะค้นหา
        let filterCompanyId;
        if (userRole === 'staff') {
            // ถ้าเป็น Staff: บังคับดูได้แค่บริษัทตัวเอง
            filterCompanyId = req.user.companyId;
        } else {
            // ถ้าเป็น Admin/Manager: ให้ใช้ค่าที่ส่งมาจาก Dropdown (ถ้ามี) 
            // ถ้าไม่มีให้ใช้บริษัทตัวเองเป็นค่าเริ่มต้น
            filterCompanyId = companyId || req.user.companyId;
        }

        // เริ่มสร้าง Query
        let query = { companyId: filterCompanyId };

        // 3. Logic การกรอง Branch (สาขา)
        if (userRole === 'staff') {
            // Staff: เห็นแค่สาขาตัวเองเท่านั้น
            if (req.user.branch) {
                query.branch = req.user.branch;
            }
        } else {
            // Admin/Manager: 
            // ถ้ามีการเลือกสาขา (และไม่ใช่ 'all') ให้เพิ่มเงื่อนไขค้นหา
            if (branch && branch !== 'all') {
                // ใช้ decodeURIComponent เผื่อกรณีภาษาไทยถูก encode มา
                // เช่น %E0%B8%A2%E0%B8%B0%E0%B8%A5%E0%B8%B2 แปลงกลับเป็น "ยะลา"
                const decodedBranch = decodeURIComponent(branch);
                query.branch = decodedBranch;
            }
            // ถ้าเลือก 'all' หรือไม่ส่งมา ก็ไม่ต้องทำอะไร (จะเห็นทุกสาขาในบริษัทนั้น)
        }

        // (Debug) ดู Query ใน Terminal ว่าถูกต้องไหม
        console.log(`[Deposits] User: ${req.user.username}, Role: ${userRole}, Query:`, JSON.stringify(query));

        // 4. ค้นหาและเรียงลำดับ
        const deposits = await Deposit.find(query).sort({ depositDate: -1 });
        res.status(200).json(deposits);

    } catch (error) {
        console.error('Get Deposits Error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    บันทึก หรือ แก้ไข ข้อมูล
exports.saveDeposit = async (req, res) => {
    try {
        const { 
            id, depositDate, customerName, phoneNumber, depositAmount, pickupDueDate,
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
            
            if (isSuccess && !deposit.signName) deposit.signName = req.user.name;

            await deposit.save();
            return res.status(200).json(deposit);
        } else {
            // --- สร้างใหม่ ---
            const newDeposit = new Deposit({
                companyId: req.user.companyId,
                // บันทึกสาขาลงไปตาม User ที่สร้าง (สำคัญมากสำหรับการกรอง)
                branch: req.user.branch || req.user.department,
                depositDate, customerName, phoneNumber, depositAmount, pickupDueDate,
                billNo, imei, product, price, isSuccess, 
                signName: '' 
            });
            await newDeposit.save();
            return res.status(201).json(newDeposit);
        }
    } catch (error) {
        console.error(error);
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