'use strict';

var mongoose = require('mongoose'),
    SponsorShip = mongoose.model('SponsorShip');
//check actor role sponsor
exports.list_all_sponsorShips = function (req, res) {
    SponsorShip.find({_id: req.params.actorId}, function (err, sponsorShips) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(sponsorShips);
        }
    });
};



