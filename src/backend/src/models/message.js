const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender_id: { type: String, required: true },
    recipient_id: { type: String, required: true },
    ad_id: { type: String, required: false },
    text: { type: String, required: true },
});

mongoose.model('Message', messageSchema, 'Message');