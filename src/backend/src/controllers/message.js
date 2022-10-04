const mongoose = require('mongoose');
const Message = mongoose.model('Message');

const createMessage = (req, res) => {
    Message.create(
        {
            sender_id: req.body.sender_id,
            recipient_id: req.body.recipient_id,
            ad_id: req.body.ad_id,
            text: req.body.text,
        },
        (error, message) => {
            if (error) {
                res.status(400).json(error);
            } else {
                res.status(201).json(message);
            }
        }
    );
};

const getMessageByID = (req, res) => {
    Message.findById(req.params.id).exec((error, message) => {
        if (!message) {
            return res.status(404).json({
                message: 'Message not found',
            });
        } else if (error) {
            res.status(500).json(error);
        }
        return res.status(200).json(message);
    });
};

const getReceivedMessages = (req, res) => {
    Message.find({ recipient_id: req.params.id }).exec((error, messages) => {
        if (!messages) {
            return res.status(404).json({
                message: 'Messages not found',
            });
        } else if (error) {
            res.status(500).json(error);
        }
        return res.status(200).json(messages);
    });
};

const getSentMessages = (req, res) => {
    Message.find({ sender_id: req.params.id }).exec((error, messages) => {
        if (!messages) {
            return res.status(404).json({
                message: 'Messages not found',
            });
        } else if (error) {
            res.status(500).json(error);
        }
        return res.status(200).json(messages);
    });
};

//DEV
const clearMessages = (req, res) => {
    res.status(200).send(Message.db.dropDatabase());
};

module.exports = {
    clearMessages,
    createMessage,
    getMessageByID,
    getReceivedMessages,
    getSentMessages,
};
