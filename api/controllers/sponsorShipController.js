'use strict';

var mongoose = require('mongoose'),
    SponsorShip = mongoose.model('SponsorShip');


exports.search_a_sponsorShip = function (req, res) {

    var actor_id = req.query.actorId;


    var aggregate_body = [];
    if (typeof actor_id !== "undefined") {
        aggregate_body = [{ $match: { sponsor: mongoose.Types.ObjectId(actor_id) } }];
    }

    SponsorShip.aggregate(aggregate_body, function (err, sponsorShip) {
        if (err) {
            res.send(err);
        } else {
            res.send(sponsorShip);
        }
    });

};


exports.update_a_sponsorShip = function (req, res) {
    SponsorShip.findById(req.params.sponsorShipId, function (err, actor) {
        if (err) {
            res.send(err);
        }
        else {
            SponsorShip.findOneAndUpdate({ _id: req.params.sponsorShipId }, req.body, {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
                runValidators: true,
                context: 'query'
            }, function (err, actor) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(actor);
                }
            });
        }
    });
};

exports.delete_a_sponsorShip = function (req, res) {
    SponsorShip.remove({ _id: req.params.sponsorShipId }, function (err, sponsorShips) {
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
