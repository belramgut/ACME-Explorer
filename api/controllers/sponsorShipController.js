'use strict';

var mongoose = require('mongoose'),
SponsorShip = mongoose.model('SponsorShip');


exports.list_all_sponsorShips = function (req, res) {
    SponsorShip.find({}, function (err, actors) {
            if (err) {
                res.send(err);
            }
            else {
                res.json(actors);
            }
        });
};    
exports.search_a_sponsorShip = function (req, res) {
    SponsorShip.findById(req.params.spId, function (err, sponsorShip) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(sponsorShip);
        }
    });
};


exports.update_a_sponsorShip = function (req, res) {
    SponsorShip.findOneAndUpdate({ _id: req.params.spId }, req.body, { new: true }, function (err, sponsorShips) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else {
            res.json(sponsorShips);
        }
    });
};
exports.delete_a_sponsorShip = function (req, res) {
    SponsorShip.deleteOne({ _id: req.params.spId }, function (err, sponsorShips) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({ message: 'SponsorShip successfully deleted' });
        }
    });
};
exports.create_a_sponsorShip = function (req, res) {
    //Check if the user is an sponsor and if not: res.status(403); "an access token is valid, but requires more privileges"
    var new_sponsorship = new SponsorShip(req.body);
    new_sponsorship.save(function (err, sponsorShip) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(sponsorShip);
        }
    });
};







