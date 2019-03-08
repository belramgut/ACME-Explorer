'use strict';

var mongoose = require('mongoose'),
    Trip = mongoose.model('Trip'),
    assert = require('assert');

exports.list_all_trips = function (req, res) {
    Trip.find({}, function (err, trips) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.json(trips);
        }
    });
};

exports.create_a_trip = function (req, res) {
    var new_trip = new Trip(req.body);
    new_trip.save(function (error, trip) {
        if (error) {
            if (error.message == "ManagerRoleError") {
                res.status(422).send({ Error: error.message, message: "The manager must have the role MANAGER" });
            } else if (error.name == "ValidationError") {
                res.status(422).send(error);
            } else {
                res.status(500).send(error);
            }
        }
        else {
            res.json(trip);
        }
    });
};

exports.read_a_trip = function (req, res) {
    Trip.findById(req.params.tripId, function (err, trip) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(trip);
        }
    });
};

exports.update_a_trip = function (req, res) {
    Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        } else {
            res.json(trip);
        }
    });
};

exports.delete_a_trip = function (req, res) {
    Trip.deleteOne({ _id: req.params.tripId }, function (err, trip) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.json({ message: 'Trip successfully deleted' });
        }
    });
};

//trips/search?&q="searchString"&sortedBy="price|title"&reverse=false|true"&startFrom="valor"&pageSize="tam"&cancelled="true|false"&published="true|false"&startingPrice="spr"&endingPrice=endpr"
exports.search_by_keyword = function (req, res) {
    var query = {};

    if (req.query.q) {
        query.$text = { $search: req.query.q };
    }

    if (req.query.startingPrice) {
        query.price = { $gte: req.query.startingPrice };
    }

    if (req.query.endingPrice) {
        query.price = { $lt: req.query.endingPrice };
    }

    if (req.query.startingPrice && req.query.endingPrice) {
        query.price = { $gte: req.query.startingPrice, $lt: req.query.endingPrice };
    }

    if (req.query.cancelled) {
        query.cancelled = req.query.cancelled;
    }

    if (req.query.published) {
        query.published = req.query.published;
    }

    var skip = 0;
    if (req.query.startFrom) {
        skip = parseInt(req.query.startFrom);
    }
    var limit = 0;
    if (req.query.pageSize) {
        limit = parseInt(req.query.pageSize);
    }

    var sort = "";
    if (req.query.reverse == "true") {
        sort = "-";
    }

    if (req.query.sortedBy) {
        sort += req.query.sortedBy;
    }

    console.log(query);
    console.log("Query: " + query + " Skip:" + skip + " Limit:" + limit);

    Trip.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(function (err, trips) {
            console.log('Start searching trips');
            if (err) {
                res.send(err);
            } else {
                res.json(trips);
            }
            console.log('End searching trips');
        });
}