var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Actor = required('./actorModel');
var SponsorShipSchema = new Schema({

    banner: {
        data: Buffer,
        contenntType: String
    },
    landingPage: {
        type: String,
        requied: 'Kindly enter the landing page'
    },
    payed: {
        type: Boolean,
        default: false
    },
    sponsor: {
        type: Schema.Types.ObjectId,
        ref: 'Actor'
    },
    trip: {
        type: Schema.Types.ObjectId,
        ref: 'Trip'
    }
})

SponsorShipSchema.pre('save', function (callback) {
    //buscar el actor por el item
    //comprobar que tiene el flat_rate a true si true payed true
    Actor.findById(this.sponsor, function (err, sponsor) {
        if (sponsor.flat_rate) {
            this.payed = true;
        }
    })

    callback();
});

module.exports = mongoose.model('SponsorShip', SponsorShipSchema);

