'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
    applicationMoment: {
        type: Date,
        default: Date.now
    },
    status: [{
        type: String,
        required: 'Kindly enter the application status',
        enum: ['PENDING', 'REJECTED', 'DUE', 'ACCEPTED', 'CANCELLED']
    }],
    comments: [String],
    explorer: {
        type: Schema.Types.ObjectId,
        ref: 'Actor'
    },
    trip: {
        type: Schema.Types.ObjectId,
        ref: 'Trip'
    },

}, { strict: false });


module.exports = mongoose.model('Application', ApplicationSchema);