'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Actor = require('./actorModel');
var Trip = require('./tripModel');

var ApplicationSchema = new Schema({
    applicationMoment: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: 'Kindly enter the application status',
        enum: ['PENDING', 'REJECTED', 'DUE', 'ACCEPTED', 'CANCELLED'],
        default: 'PENDING'
    },
    comments: [String],
    explorer: {
        type: Schema.Types.ObjectId,
        ref: 'Actor'
    },
    trip: {
        type: Schema.Types.ObjectId,
        ref: 'Trip',
        index: true
    },

}, { strict: false });


ApplicationSchema.pre('save', async function (callback) {
    const man = await Actor.findOne({ _id: this.explorer }).exec();
    if (!(man.actorType.indexOf("EXPLORER") > -1)) {
        callback(new Error('ExplorerRoleError'));
    };

    const trip = await Trip.findOne({ _id: this.trip }).exec();
    var now = new Date();
    if (!trip.published || trip.startDate < now || trip.cancelled) {
        callback(new Error('ApplicationError'));
    };

    callback();
});

module.exports = mongoose.model('Application', ApplicationSchema);