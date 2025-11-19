// server/models/Task.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true }, // เก็บชื่อ User ที่คอมเมนต์
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const HistorySchema = new Schema({
    byUser: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true }, // e.g., 'status-change', 'created'
    from: { type: String },
    to: { type: String },
    timestamp: { type: Date, default: Date.now }
});

const TaskSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
        type: String,
        required: true,
        enum: ['todo', 'in-progress', 'for-review', 'completed'],
        default: 'todo'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    branch: { 
        type: String, 
        default: null 
    },
    companyId: { type: String, ref: 'Company' },
    createdAt: { type: Date, default: Date.now },
    dueDate: { type: Date },
    
    // ----- Relationships -----
    createdBy: { 
        type: Schema.Types.ObjectId, // ID จริงจาก MongoDB
        ref: 'User', 
        required: true 
    },
    assignedTo: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    // visibleTo: ใช้สำหรับให้ผู้บริหาร/HR มองเห็นงานของแผนกอื่น
    // เราจะเพิ่มส่วนนี้ทีหลังเพื่อความง่ายก่อน
    
    // ----- Sub-documents -----
    comments: [CommentSchema],
    history: [HistorySchema]
});

// เมื่อสร้างงานใหม่ ให้บันทึกประวัติ "created" อัตโนมัติ
TaskSchema.pre('save', function(next) {
    if (this.isNew) {
        this.history.push({
            byUser: this.createdBy,
            action: 'created',
            to: this.status
        });
    }
    next();
});

module.exports = mongoose.model('Task', TaskSchema, 'tasks');
// 'Task' คือชื่อ Model, TaskSchema คือพิมพ์เขียว, 'tasks' คือชื่อ Collection จริง