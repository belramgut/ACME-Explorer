'use strict';

var mongoose = require('mongoose'),
Finder = mongoose.model('Finder');

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