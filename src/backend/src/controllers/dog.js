const mongoose = require('mongoose');
const Dog = mongoose.model('Dog');

const createDog = (req, res) => {
    Dog.create(
        {
            owner_id: req.body.owner_id,
            name: req.body.name,
            age: req.body.age,
            breed: req.body.breed,
            picture_id: req.picture_id,
        },
        (error, dog) => {
            if (error) {
                res.status(400).json(error);
            } else {
                res.status(201).json(dog);
            }
        }
    );
};

const getDogsByOwner = (req, res) => {
    if (!req.params.ownerID) {
        return res.status(404).json({
            message: 'Please provide a user ID.',
        });
    } else {
        Dog.find({ owner_id: req.params.ownerID }).exec((error, dogs) => {
            if (!dogs) {
                res.status(404).json({
                    message: 'No dogs were found',
                });
            } else if (error) {
                res.status(500).json(error);
            }
            res.status(200).json(dogs);
        });
    }
};

const getDogById = (req, res) => {
    if (!req.params.dogID) {
        return res.status(404).json({
            message: 'Dog was not found, id required',
        });
    } else {
        Dog.findById(req.params.dogID).exec((error, dog) => {
            if (!dog) {
                res.status(404).json({
                    message: 'Dog with provided id was not found.',
                });
            } else if (error) {
                res.status(500).json(error);
            }
            res.status(200).json(dog);
        });
    }
};

const getDogs = (req, res) => {
    Dog.find().exec((error, dogs) => {
        if (!dogs) {
            res.status(404).json({
                message: 'No dogs were found',
            });
        } else if (error) {
            res.status(500).json(error);
        }
        res.status(200).json(dogs);
    });
};


const axios = require('axios').create()
const getBreeds = (req, res) => {
    let config = { 'x-api-key': '34ca4517-b00d-4a39-a0a2-b72f52c18614' };
    axios
        .get('https://api.thedogapi.com/v1/breeds', { headers: config })
        .then((response) => {
            if (response) {
                let breeds = [];
                response.data.forEach((breed) => {
                    breeds.push(breed.name);
                });
                res.status(201).json({
                    breed_list: breeds,
                });
            }
            else {
                res.status(500).json({
                    message: 'Could not get breed list',
                });
            }
        });
};

//DEV
const clearDogs = (req, res) => {
    res.status(200).send(Dog.db.dropDatabase());
};

module.exports = {
    clearDogs,
    createDog,
    getDogsByOwner,
    getDogById,
    getDogs,
    getBreeds,
};
