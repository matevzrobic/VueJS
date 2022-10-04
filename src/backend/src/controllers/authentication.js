const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const registration = (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.name || !req.body.surname) {
        return res.status(400).json({ message: 'Missing data' });
    } else if (
        !/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
            req.body.email
        )
    ) {
        return res.status(400).json({ message: 'Invalid email' });
    }
    const user = new User();
    user.email = req.body.email;
    user.name = req.body.name;
    user.surname = req.body.surname;
    user.setPassword(req.body.password);
    user.enabled = true;
    user.role = req.body.role;
    user.save((error) => {
        if (error) {
            if (error.errors.email)
                res.status(409).json({
                    message: 'This email is already used for another account',
                });
            else {
                res.status(500).json(error);
            }
        } else {
            res.status(200).json({ token: user.generateJWT() });
        }
    });
};

const login = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Missing data' });
    } else if (
        !/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
            req.body.email
        )
    ) {
        return res.status(400).json({ message: 'Invalid email' });
    }
    passport.authenticate('local', (error, user, info) => {
        if (error) return res.status(500).json(error);
        if (user) {
            res.status(200).json({ token: user.generateJWT() });
        } else {
            res.status(401).json(info);
        }
    })(req, res, next);
};

module.exports = {
    registration,
    login,
};
