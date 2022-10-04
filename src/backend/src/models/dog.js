const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
    owner_id: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    breed: { type: String, required: true },
    picture_id: { type: String, required: false },
});

mongoose.model('Dog', dogSchema, 'Dog');
