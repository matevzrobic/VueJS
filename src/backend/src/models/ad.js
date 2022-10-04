const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    author_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dateCreated: { type: Date, required: true },
    dateNeeded: { type: Date, required: true },
    location: { type: String, required: true },
    dog_ids: { type: [String], required: true },
    isDone: { type: Boolean, required: true },
    active: { type: Boolean, required: true },
    applicant_id: { type: String, required: false },
});

mongoose.model('Ad', adSchema, 'Ad');
