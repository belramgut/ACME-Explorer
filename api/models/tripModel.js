'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
Stage = require('./stageModel')

var TripSchema = new Schema({
    ticker: {
        type: String,
    },
    title: {
        type: String,
        required: 'Please, enter a title for this trip'
    },
    description: {
        type: String,
        required: 'Please, enter a description for this trip'
    },
    price: {
        type: Number,
        min: 0,
    },
    requirements: {
        type: [String],
        required: 'Please, enter a list of requirements for this trip'
    },
    startDate: {
        type: Date,
        required: 'Please, enter a start date for this trip'
    },
    endDate: {
        type: Date,
        required: 'Please, enter an end date for this trip'
    },
    pictures: {
        type: [{ data: Buffer, contentType: String }],
        default: []
    },
    cancelled: {
        type: boolean,
        default: false
    },
    cancelationReasons: {
        type: String
    },
    published: {
        type: boolean,
        default: false
    },
    stages: [Stage]
}, { strict: false });


module.exports = mongoose.model('Trip', TripSchema);