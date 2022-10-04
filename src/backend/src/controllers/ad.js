const mongoose = require('mongoose');
const Ad = mongoose.model('Ad');

const getAdList = (req, res) => {
    Ad.find().exec((error, ads) => {
        if (!ads) {
            return res.status(404).json({
                message: 'Ads not found',
            });
        } else if (error) {
            res.status(500).json(error);
        }
        return res.status(200).json(ads);
    });
};

const getAdsByUser = (req, res) => {
    if (!req.params.userID) {
        return res.status(404).json({
            message: 'Please provide a user ID.',
        });
    } else {
        Ad.find({ author_id: req.params.userID }).exec((error, ads) => {
            if (!ads) {
                res.status(404).json({
                    message: 'No ads were found',
                });
            } else if (error) {
                res.status(500).json(error);
            }
            res.status(200).json(ads);
        });
    }
};

const getAdByID = (req, res) => {
    if (!req.params.adID) {
        return res.status(404).json({
            message: 'Ad not found, adID is required',
        });
    } else {
        Ad.findById(req.params.adID).exec((error, ad) => {
            if (!ad) {
                return res.status(404).json({
                    message: 'Ad with adID not found',
                });
            } else if (error) {
                return res.status(500).json(error);
            }
            res.status(200).json(ad);
        });
    }
};

const createAd = (req, res) => {
    Ad.create(
        {
            author_id: req.body.author_id,
            title: req.body.title,
            description: req.body.description,
            dateCreated: Date.now(),
            dateNeeded: req.body.dateNeeded,
            location: req.body.location,
            dog_ids: req.body.dog_ids,
            isDone: false,
            active: false,
        },
        (error, ad) => {
            if (error) {
                res.status(400).json(error);
            } else {
                res.status(201).json(ad);
            }
        }
    );
};

const updateAd = (req, res) => {
    if (!req.params.adID) {
        return res.status(404).json({
            message: 'Ad not found, adID is required',
        });
    }
    Ad.findById(req.params.adID).exec((error, ad) => {
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        } else if (error) {
            return res.status(500).json(error);
        }
        if (req.body.title) {
            ad.title = req.body.title;
        }
        if (req.body.description) {
            ad.description = req.body.description;
        }
        if (req.body.dateNeeded) {
            ad.dateNeeded = req.body.dateNeeded;
        }
        if (req.body.location) {
            ad.location = req.body.location;
        }
        if (req.body.dog_ids) {
            ad.dog_ids = req.body.dog_ids;
        }
        if (typeof req.body.active !== 'undefined') {
            if (ad.active) {
                return res.status(404).json({
                    message: 'Ad is already active',
                });
            } else {
                ad.active = req.body.active;
                ad.applicant_id = req.body.applicant_id;
            }
        }
        if (typeof req.body.isDone !== 'undefined') {
            ad.isDone = req.body.isDone;
        }

        ad.save((error, ad) => {
            if (error) {
                res.status(404).json(error);
            } else {
                res.status(200).json(ad);
            }
        });
    });
};

const deleteAd = (req, res) => {
    if (!req.params.adID) {
        return res.status(404).json({
            message: 'Ad not found, adID is required',
        });
    } else {
        Ad.findByIdAndDelete(req.params.adID).exec((error) => {
            if (error) {
                return res.status(500).json(error);
            }
            res.status(204).json(null);
        });
    }
};

//DEV
const clearAds = (req, res) => {
    res.status(200).send(Ad.db.dropDatabase());
};

module.exports = {
    getAdList,
    clearAds,
    createAd,
    updateAd,
    deleteAd,
    getAdByID,
    getAdsByUser,
};
