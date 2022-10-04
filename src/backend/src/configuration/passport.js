const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        (email, password, pkDone) => {
            User.findOne({ email: email }, (error, user) => {
                if (error) {
                    return pkDone(error);
                }
                if (!user) {
                    return pkDone(null, false, {
                        message: 'Wrong email',
                    });
                }
                if (!user.enabled) {
                    return pkDone(null, false, {
                        message: "This user's account has been disabled",
                    });
                }
                if (!user.checkPassword(password)) {
                    return pkDone(null, false, {
                        message: 'Wrong password',
                    });
                }
                return pkDone(null, user);
            });
        }
    )
);
