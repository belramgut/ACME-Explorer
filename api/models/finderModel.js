'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var FinderSchema = new Schema({
    keyword: [{
        type: String,
        required: 'Kindly enter the keyword'
    }],
    lowerPrice: {
        type: Number,
        min: 0,
    },
    higherPrice: {
        type: Number,
        min: 0,
    },
    fromDate: {
        type: Date,
        required: 'Please, enter a start date for this finder'
    },
    toDate: {
        type: Date,
        required: 'Please, enter an end date for this finder'
    },
    explorer: {
        type: Schema.Types.ObjectId,
        ref: 'Actor'
    },

}, { strict: false });


module.exports = mongoose.model('Finder', FinderSchema);