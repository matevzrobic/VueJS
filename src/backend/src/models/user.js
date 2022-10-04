const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const JWT_PASSWORD = 'KRNEKIZAENKRAT';
const uniqueValidator = require('mongoose-unique-validator');

const ratingSchema = new mongoose.Schema({
    author_name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    hashValue: { type: String, required: true },
    randomValue: { type: String, required: true },
    role: { type: String, enum: ['admin', 'moderator', 'owner', 'walker'] },
    enabled: { type: Boolean, required: true },
    profile_picture_id: { type: String, required: false },
    average_rating: { type: Number, required: false, min: 1, max: 5 },
    ratings_list: [ratingSchema],
});

userSchema.methods.setPassword = function (password) {
    this.randomValue = crypto.randomBytes(16).toString('hex');
    this.hashValue = crypto
        .pbkdf2Sync(password, this.randomValue, 1000, 64, 'sha512')
        .toString('hex');
};

userSchema.methods.checkPassword = function (password) {
    const hashValue = crypto
        .pbkdf2Sync(password, this.randomValue, 1000, 64, 'sha512')
        .toString('hex');
    return this.hashValue === hashValue;
};

userSchema.methods.generateJWT = function () {
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 7);

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            surname: this.surname,
            average_rating: this.average_rating,
            ratings_list: this.ratings_list,
            enabled: this.enabled,
            role: this.role,
            exp: parseInt((expiration.getTime() / 1000).toString(), 10),
        },
        JWT_PASSWORD
    );
};

userSchema.plugin(uniqueValidator);
mongoose.model('Rating', ratingSchema, 'Rating');
mongoose.model('User', userSchema, 'User');
