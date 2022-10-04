const mongoose = require('mongoose');
require('./user');
require('./ad');
require('./dog');
require('./report');
require('./message');

let dbURI = 'mongodb://localhost:TPO';
if (process.env.NODE_ENV === 'production') {
    dbURI =
        'mongodb+srv://nvelik:tpo@tpo-dog-walker-db.xixj9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
} else if (process.env.NODE_ENV === 'docker') {
    dbURI = 'mongodb://localhost:TPO';
}

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}.`);
});

mongoose.connection.on('error', (error) => {
    console.log('Mongoose encountered an error: ', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected.');
});

const shutdown = (message, callback) => {
    mongoose.connection.close(() => {
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
