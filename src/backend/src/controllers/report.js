const mongoose = require('mongoose');
const Report = mongoose.model("Report")

const getReports = (req, res) => {
    Report.find().exec((error, reports) => {
        if (!reports) {
            return res.status(404).json({
                message: 'Reports not found',
            });
        } else if (error) {
            res.status(500).json(error);
        }
        return res.status(200).json(reports);
    });
};

const createReport = (req, res) => {
    Report.create(
        {
            reported_account_id: req.body.reported_account_id,
            reported_by_id: req.body.reported_by_id,
            reason: req.body.reason,
            date: req.body.date
        },
        (error, report) => {
            if (error) {
                res.status(400).json(error);
            } else {
                res.status(201).json(report);
            }
        }
    );
};

const getReportByID = (req, res) => {
    Report.findById(req.params.id).exec((error, report) => {
        if (!report) {
            return res.status(404).json({
                message: 'Reports not found',
            });
        } else if (error) {
            res.status(500).json(error);
        }
        return res.status(200).json(report);
    });
};

//DEV
const clearReports = (req, res) => {
    res.status(200).send(Report.db.dropDatabase());
};

module.exports = {
    clearReports,
    getReports,
    createReport,
    getReportByID,
}
