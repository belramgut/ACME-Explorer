'use strict';

var mongoose = require('mongoose'),
    SponsorShip = mongoose.model('SponsorShip');

exports.list_all_sponsorShips = function (req, res) {
    //check actor role sponsor recibo req.params.actorId
    SponsorShip.find({ _id: req.params.actorId }, function (err, sponsorShips) {

        if (err) {
            res.send(err);
        }
        else {
            res.json(sponsorShips);
        }
    });
};



