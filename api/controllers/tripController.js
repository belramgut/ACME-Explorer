'use strict';

var mongoose = require('mongoose'),
    Trip = mongoose.model('Trip');

exports.list_all_trips = function (req, res) {
    Trip.find({}, function (err, trips) {
        if (err) {
            res.send(err);
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
            res.send(error);
        }
        else {
            res.json(trip);
        }
    });
};

exports.read_a_trip = function (req, res) {
    Trip.findById(req.params.tripId, function (err, trip) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(trip);
        }
    });
};

exports.update_a_trip = function (req, res) {
    Trip.findById(req.params.tripId, function (err, trip) {
        if (err) {
            res.send(err);
        }
        else {
            Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, order) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(trip);
                }
            });
        }
    });
};

exports.delete_a_trip = function (req, res) {
    Trip.remove({
        _id: req.params.tripId
    }, function (err, trip) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({ message: 'Trip successfully deleted' });
        }
    });
};

//trips/search?&q="searchString"&startFrom="valor"&pageSize="tam"
exports.search_by_keyword = function (req, res) {
    var query = {};

    if (req.query.q) {
        query.$text = { $search: req.query.q };
    }

    var skip = 0;
    if (req.query.startFrom) {
        skip = parseInt(req.query.startFrom);
    }
    var limit = 0;
    if (req.query.pageSize) {
        limit = parseInt(req.query.pageSize);
    }

    console.log("Query: " + query + " Skip:" + skip + " Limit:" + limit);

    Trip.find(query)
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