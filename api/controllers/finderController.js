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
            Trip.find({}, function (err, trips) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(trips)
                }
            });
        }
    });
};

exports.dashboard = function (req, res) {
    Finder.aggregate([
        {"$project": {"_id":0, "range": {"$subtract": ["$higherPrice", "$lowerPrice"]}}}, 
        {"$group": {"_id": 0, "avgRange": {"$avg": "$range"}}}
        ], function (err, finderResult1) {
        if (err) {
            res.send(err);
        }
        else {
            var result1 = finderResult1[0];
            Finder.aggregate([
                {"$project": {"_id":0, "keyword": {$toLower: "$keyword"}}},
                {"$group": {"_id": "$keyword", "count": {"$sum": 1}}},
                { "$sort" : { count : -1} },
                { "$limit" : 10 }
                ], function (err, finderResult2) {
                if (err) {
                    res.send(err);
                }
                else {
                    var result = {"avgRange": result1.avgRange, "top_keywords": finderResult2}
                    res.send(result);
                }
            });
        }
    });
};