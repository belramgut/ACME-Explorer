'use strict';

var mongoose = require('mongoose'),
    Application = mongoose.model('Application');
var ObjectId = require('mongoose').Types.ObjectId;

exports.search_applications = function (req, res) {

    var trip_id = req.query.tripId;
    var actor_id = req.query.actorId;
    var groupby = req.query.groupby;

    var aggregate_body = [];
    if (typeof trip_id !== "undefined"){
        aggregate_body = [{$match: {trip: ObjectId(trip_id)}}];
    } else if (typeof actor_id !== "undefined" && typeof groupby !== "undefined") {
        aggregate_body = [{$match: {explorer: ObjectId(actor_id)}}, { $group : {_id : "$status", applications: { $push : "$$ROOT" }}}];
    }

    Application.aggregate(aggregate_body, function (err, applications) {
        if (err) {
            res.send(err);
        }else {
            res.send(applications);
        }
    });
};

exports.create_an_application = function (req, res) {
    var new_application = new Application(req.body);

    new_application.save(function (error, application) {
        if (error && error.message == "ExplorerRoleError") {
            res.status(422).send({ Error: error.message, message: "The explorer must have the role EXPLORER" });
        } else if (error && error.message == "ApplicationError") {
            res.status(422).send({ Error: error.message, message: "Trip has not been published or is started or cancelled" });
        } else if (error) {
            res.send(error);
        }
        else {
            res.json(application);
        }
    });
};

exports.read_an_application = function (req, res) {
    Application.findById(req.params.applicationId, function (err, application) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(application);
        }
    });
};

exports.update_an_application = function (req, res) {
    Application.findById(req.params.applicationId, function (err, application) {
        if (err) {
            res.send(err);
        }
        else {
            var new_application = req.body;

            if (new_application.status == 'DUE' || new_application.status == 'REJECTED') {
                if (application.status != 'PENDING') {
                    res.status(422).send({ message: 'Application status can change from PENDING to DUE or REJECTED' });
                } else {
                    Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true }, function (err, application) {
                        if (err) {
                            res.send(err);
                        }
                        else {
                            res.send(application);
                        }
                    });
                }
            } else if (new_application.status == 'CANCELLED') {
                if (application.status != 'PENDING' && application.status != 'ACCEPTED') {
                    res.status(422).send({ message: 'Application status can change to CANCELLED from PENDING or ACCEPTED' });
                } else {
                    Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true }, function (err, application) {
                        if (err) {
                            res.send(err);
                        }
                        else {
                            res.send(application);
                        }
                    });
                }
            } 
        }
    });
};

exports.delete_an_application = function (req, res) {
    Application.remove({
        _id: req.params.applicationId
    }, function (err, application) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({ message: 'Application successfully deleted' });
        }
    });
};