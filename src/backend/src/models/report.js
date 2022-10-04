const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reported_account_id: { type: String, required: true },
    reported_by_id: { type: String, required: true },
    reason: { type: String, required: true },
    date: { type: Date, required: true },
});

mongoose.model('Report', reportSchema, 'Report');
