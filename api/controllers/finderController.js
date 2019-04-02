'use strict';

var mongoose = require('mongoose'),
Finder = mongoose.model('Finder'),
Trip = mongoose.model('Trip');

exports.search_finders = function (req, res) {
    Finder.find({}, function (err, finders) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(finders);
        }
    });
};

exports.create_a_finder = function (req, res) {
    var new_finder = new Finder(req.body);

    new_finder.save(function (error, finder) {
        if (error) {
            res.send(error);
        }
        else {
            res.json(finder);
        }
    });
};

exports.update_a_finder = function (req, res) {
    Finder.findById(req.params.finderId, function (err, finder) {
        if (err) {
            res.send(err);
        }
        else {
            Finder.findOneAndUpdate({ _id: req.params.finderId }, req.body, { new: true }, function (err, finder) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(finder);
                }
            });
        }
    });
};

exports.delete_an_finder = function (req, res) {
    Finder.remove({
        _id: req.params.finderId
    }, function (err, finder) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({ message: 'Finder successfully deleted' });
        }
    });
};


exports.apply_search = function (req, res) {
    Finder.findById(req.params.finderId, function (err, finder) {
        if (err) {
            res.send(err);
        }
        else {
            Trip.find({price: { $gt: finder.lowerPrice, 
                                $lt: finder.higherPrice}, 
                       startDate: { $gt: finder.fromDate},
                       endDate: {$lt: finder.toDate}, 
                       $text: { $search: finder.keyword}}, 
            function (err, trips) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(trips)
                }
            });
        }
    });
};