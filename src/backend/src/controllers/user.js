const mongoose = require('mongoose');
const User = mongoose.model('User');
const Rating = mongoose.model('Rating');

const getUserList = (req, res) => {
    User.find().exec((error, users) => {
        if (!users) {
            return res.status(404).json({
                message: 'Users not found',
            });
        } else if (error) {
            res.status(500).json(error);
        }
        return res.status(200).json(users);
    });
};

const getUserByID = (req, res) => {
    if (!req.params.id) {
        return res.status(404).json({
            message: 'User was not found, id required',
        });
    } else {
        User.findById(req.params.id).exec((error, user) => {
            if (!user) {
                res.status(404).json({
                    message: 'User with provided id was not found.',
                });
            } else if (error) {
                res.status(500).json(error);
            } else {
                res.status(200).json(user);
            }
        });
    }
};

const deleteUsers = (req, res) => {
    res.status(200).send(User.db.dropDatabase());
};

const updateUserInfo = (req, res) => {
    User.findById(req.params.id).exec((error, user) => {
        if (!user) {
            return res
                .status(404)
                .json({ message: 'User with given email not found.' });
        } else if (error) {
            return res.status(500).json(error);
        }
        if (req.body.name) {
            user.name = req.body.name;
        }
        if (req.body.surname) {
            user.surname = req.body.surname;
        }
        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.password) {
            user.setPassword(req.body.password);
        }
        if (typeof req.body.enabled !== 'undefined') {
            user.enabled = req.body.enabled;
        }
        user.save((error, user) => {
            if (error) {
                res.status(404).json(error);
            } else {
                res.status(200).json({ token: user.generateJWT() });
            }
        });
    });
};

const addRating = (req, res) => {
    if (!req.params.id) {
        res.status(400).json({
            message: 'Cannot find ad with given id',
        });
    } else {
        User.findById(req.params.id)
            .select('ratings_list')
            .exec((error, user) => {
                if (error) {
                    res.status(400).json(error);
                } else {
                    let rating = {
                        author_name: req.body.author_name,
                        rating: req.body.rating,
                        comment: req.body.comment,
                    };
                    user.ratings_list.push(rating);
                    user.average_rating = calcRating(user.ratings_list);
                    user.save((error, user) => {
                        if (error) {
                            res.status(400).json(error);
                        } else {
                            res.status(201).json(user);
                        }
                    });
                }
            });
    }
};

const calcRating = (ratings) => {
    let sum = 0;
    for (let i = 0; i < ratings.length; i++) {
        sum += ratings[i].rating;
    }
    return sum / ratings.length;
};

//DEV
const clearRatings = (req, res) => {
    res.status(200).send(Rating.db.dropDatabase());
};

const clearUsers = (req, res) => {
    res.status(200).send(User.db.dropDatabase());
};

const axios = require('axios').create();
const initUsers = async (req, res) => {
    let json = JSON.stringify({
        email: 'admin@admin.com',
        name: 'admin',
        surname: 'admin',
        password: 'admin',
        role: 'admin',
    });
    const re1 = await axios.post(
        'http://localhost:3000/api/registration',
        json,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    json = JSON.stringify({
        email: 'moderator@moderator.com',
        name: 'moderator',
        surname: 'moderator',
        password: 'moderator',
        role: 'moderator',
    });
    const re2 = await axios.post(
        'http://localhost:3000/api/registration',
        json,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    json = JSON.stringify({
        email: 'owner@owner.com',
        name: 'owner',
        surname: 'owner',
        password: 'owner',
        role: 'owner',
    });
    const re3 = await axios.post(
        'http://localhost:3000/api/registration',
        json,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    json = JSON.stringify({
        email: 'walker@walker.com',
        name: 'walker',
        surname: 'walker',
        password: 'walker',
        role: 'walker',
    });
    const re4 = await axios.post(
        'http://localhost:3000/api/registration',
        json,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    return res.status(200).json();
};

module.exports = {
    clearUsers,
    clearRatings,
    getUserList,
    deleteUsers,
    updateUserInfo,
    getUserByID,
    addRating,
    initUsers,
};
