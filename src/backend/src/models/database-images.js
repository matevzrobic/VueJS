const mongoose = require('mongoose');
const fs = require('fs');

let dbURI = 'mongodb://localhost:IMAGE';

const conn1 = mongoose.createConnection(dbURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

conn1.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}.`);
});

conn1.on('error', (error) => {
    console.log('Mongoose encountered an error: ', error);
});

conn1.on('disconnected', () => {
    console.log('Mongoose disconnected.');
});

const shutdown = (message, callback) => {
    conn1.close(() => {
        console.log(`Mongoose closed connection over '${message}'.`);
        callback();
    });
};

process.once('SIGUSR2', () => {
    shutdown('Nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

process.on('SIGINT', () => {
    shutdown('Exit app', () => {
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    shutdown('Exit app in Heroku', () => {
        process.exit(0);
    });
});

const imgSchema = new mongoose.Schema({
    name: String,
    img: {
        data: Buffer,
        contentType: String,
    },
});

const img = conn1.model('Image', imgSchema, 'Image');

const getImage = (req, res) => {
    img.findById(req.params.id, (err, image) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        } else {
            res.status(200).json(image);
        }
    });
};

const postImage = (req, res) => {
    const obj = {
        name: req.body.name,
        img: {
            data: fs.readFileSync(__dirname + '/uploads/' + req.file.filename),
            contentType: 'image/png',
        },
    };
    img.create(obj, (err, image) => {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.status(200).json(image);
        }
    });
}

module.exports = {
    getImage,
    postImage,
}