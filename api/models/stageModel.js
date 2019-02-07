'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StageSchema = new Schema({
    title: {
        type: String,
        required: 'Please, enter a title for this stage'
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        min: 0
    }

}, { strict: false });