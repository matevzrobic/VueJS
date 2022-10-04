const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const db = require('./models/database');
//const image = require('./models/database-images');
const passport = require('passport');

const app = express();
var port = normalizePort(process.env.PORT || '3000');

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https')
            res.redirect(`https://${req.header('host')}${req.url}`);
        else next();
    });
}

const jwt = require('express-jwt');
/*const authentication = jwt({
    secret: process.env.JWT_PASSWORD,
    userProperty: 'payload',
    algorithms: ['HS256'],
});*/

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
require('./configuration/passport');

app.use('/api', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.charset = 'utf-8';
    next();
});

/*const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/models/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    },
});*/

//const upload = multer({ storage: storage });

app.use('/api', router);

/* istanbul ignore next */
if(process.env.NODE_ENV !== "production") {
    require('@cypress/code-coverage/middleware/express')(app);
}

//controllers
const ctrlAuthentication = require('./controllers/authentication');
const ctrlUser = require('./controllers/user');
const ctrlAd = require('./controllers/ad');
const ctrlDog = require('./controllers/dog');
const ctrlMail = require('./controllers/emailer');
const ctrlReport = require('./controllers/report');
const ctrlMessage = require('./controllers/message');

//routes
//users
router.get('/users', ctrlUser.getUserList);
router.get('/users/:id', ctrlUser.getUserByID);
router.delete('/users', ctrlUser.deleteUsers);
router.put('/users/:id', ctrlUser.updateUserInfo);
router.post('/users/:id/rating', ctrlUser.addRating);

//authentication
router.post('/registration', ctrlAuthentication.registration);
router.post('/login', ctrlAuthentication.login);

//ads
router.get('/ads', ctrlAd.getAdList);
router.get('/ads/id/:adID', ctrlAd.getAdByID);
router.get('/ads/user/:userID', ctrlAd.getAdsByUser);
router.post('/ads', ctrlAd.createAd);
router.put('/ads/:adID', ctrlAd.updateAd);
router.delete('/ads/:adID', ctrlAd.deleteAd);

//dogs
router.get('/dogs/breeds', ctrlDog.getBreeds);
router.get('/dogs/user/:ownerID', ctrlDog.getDogsByOwner);
router.get('/dogs/id/:dogID', ctrlDog.getDogById);
router.post('/dogs', ctrlDog.createDog);
router.get('/dogs', ctrlDog.getDogs);

//reports
router.get('/reports', ctrlReport.getReports);
router.get('/reports/:id', ctrlReport.getReportByID);
router.post('/reports', ctrlReport.createReport);

//messages
router.get('/messages/received/:id', ctrlMessage.getReceivedMessages);
router.get('/messages/sent/:id', ctrlMessage.getSentMessages);
router.get('/messages/id/:id', ctrlMessage.getMessageByID);
router.post('/messages', ctrlMessage.createMessage);

//mail
router.post('/mail', ctrlMail.mailSend);
router.options('/mail', ctrlMail.mailOptions);

//image
//router.post('/images', upload.single('image'), image.postImage);

//dev
router.delete('/dev/ads', ctrlAd.clearAds);
router.delete('/dev/dogs', ctrlDog.clearDogs);
router.delete('/dev/messages', ctrlMessage.clearMessages);
router.delete('/dev/reports', ctrlReport.clearReports);
router.delete('/dev/ratings', ctrlUser.clearRatings);
router.delete('/dev/users', ctrlUser.clearUsers);
router.post('/init', ctrlUser.initUsers);

app.listen(port, () => {
    console.log(`Example app listening at ${port}`);
});

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

module.exports = {
    app,
    router,
};
//final pls
