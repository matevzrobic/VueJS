var nodemailer = require('nodemailer');

const mailOptions = (req, res) => {
    //console.log('Email coming here');
    res.sendStatus(200);
};

const mailSend = (req, res) => {
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'wearethedogwalkerslol@gmail.com',
            pass: 'DogWalkers123',
        },
    });
    let name = req.body.name;
    let message = req.body.message;
    let email = req.body.email;
    var mailOptions = {
        from: 'wearethedogwalkerslol@gmail.com',
        to: 'wearethedogwalkerslol@gmail.com',
        subject: 'Povprasevanje',
        text:
            'Ime: ' +
            name +
            '\nPovratni email naslov: ' +
            email +
            '\n\n' +
            message,
    };

    transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).send('error');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(201).send('Sent successfully');
        }
    });
};

module.exports = {
    mailOptions,
    mailSend,
};
