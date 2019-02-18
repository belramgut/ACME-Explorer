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
        validate: [lowerPriceValidator, 'Lower price must be lower or equal than higher price']
    },
    higherPrice: {
        type: Number,
        min: 0,
        validate: [higherPriceValidator, 'Higher price must be lower or equal than lower price']
    },
    fromDate: {
        type: Date,
        required: 'Please, enter a start date for this finder',
        validate: [fromDateValidator, 'From date must be lower or equal than to date']
    },
    toDate: {
        type: Date,
        required: 'Please, enter an end date for this finder',
        validate: [toDateValidator, 'To date must be lower or equal than from date']
    },
    explorer: {
        type: Schema.Types.ObjectId,
        ref: 'Actor'
    },

}, { strict: false });

function fromDateValidator(from_date) {
    return from_date <= this.toDate;
}

function toDateValidator(to_date) {
    return to_date >= this.fromDate;
}

function lowerPriceValidator(lower_price) {
    return lower_price <= this.higherPrice;
}

function higherPriceValidator(higher_price) {
    return higher_price >= this.lowerPrice;
}

module.exports = mongoose.model('Finder', FinderSchema);