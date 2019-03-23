'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = require('mongoose').Types.ObjectId;
var Actor = require('./actorModel');

const generate = require('nanoid/generate');
const dateFormat = require('dateformat');

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


var TripSchema = new Schema({
    ticker: {
        type: String,
        unique: true,
        validate: {
            validator: function (v) {
                return /^([12]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))-[A-Z]{4}$/.test(v);
            },
            message: 'ticker is not valid!, Pattern("^([12]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))-[A-Z]{4}$")'
        }

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
        required: 'Please, enter a start date for this trip',
        validate: [startDateValidator, 'Start date must be after the current date']
    },
    endDate: {
        type: Date,
        required: 'Please, enter an end date for this trip',
        validate: [dateValidator, 'Start date must be before the end date']
    },
    pictures: {
        type: [{ data: Buffer, contentType: String }],
        default: []
    },
    cancelled: {
        type: Boolean,
        default: false,
        validate: [{ validator: cancelledValidator, msg: 'If the trip is cancelled, there must be a reason why' },
        { validator: cancelledPublished, msg: "The trip must not be pusblished to be cancelled" },
        { validator: cancelledStartDate, msg: "The trip must not be start to be cancelled" }]
    },
    cancelationReasons: {
        type: String,
    },
    published: {
        type: Boolean,
        default: false
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'Actor',
    },
    stages: [StageSchema]
}, { strict: false });


TripSchema.pre('save', async function (callback) {

    var new_trip = this;
    var date = new Date;
    var day = dateFormat(new Date(), "yymmdd");

    const man = await Actor.findOne({ _id: this.manager }).exec();
    if (!(man.actorType.indexOf("MANAGER") > -1)) {
        callback(new Error('ManagerRoleError'));
    };

    var generated_ticker = [day, generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)].join('-')

    const Trip = this.constructor;
    let count = await Trip.find({ ticker: generated_ticker }).count().exec();

    while (count > 0) {
        console.log("The ticker already exists, ...generating a new one...");
        generated_ticker = [day, generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)].join('-')
        count = await Trip.find({ ticker: generated_ticker }).count().exec();
    }

    new_trip.ticker = generated_ticker;

    var generated_price = 0.0;

    this.stages.forEach(element => {
        generated_price = generated_price + element.price
    });

    this.price = generated_price;

    callback();

});

TripSchema.index({ ticker: 'text', title: 'text', description: 'text' }, { weights: { ticker: 10, title: 5, description: 1 } });
TripSchema.index({ price: 1 });


function dateValidator(value) {
    var std = this.startDate;
    if (!std) {
        std = new Date(this.getUpdate().startDate);
    }
    return std <= value;
}

function startDateValidator(value) {
    var date1 = new Date;
    var date_tomorrow = new Date(date1.getTime() + 86400000);
    var std = this.startDate;
    if (!std) {
        std = new Date(this.getUpdate().startDate);
    }
    return std >= date_tomorrow;
}

function cancelledValidator(value) {
    var cr = this.cancelationReasons;
    if (!cr) {
        cr = this.getUpdate().cancelationReasons
    }
    if (value == true && cr == undefined) {
        return false;
    }
}

function cancelledPublished(value) {
    var p = this.published

    if (p != false) {
        if (p != true) {
            p = this.getUpdate().published
        }
    }

    if (value == true && p == true) {
        return false;
    }
}

function cancelledStartDate(value) {
    var std = this.startDate;
    if (!std) {
        std = new Date(this.getUpdate().startDate);
    }
    if (value == true && std <= new Date) {
        return false;
    }
}

TripSchema.pre('findOneAndUpdate', function (next) {

    if (this.getUpdate().stages) {
        this.getUpdate().price = this.getUpdate().stages.map((stage) => {
            return stage.price
        }).reduce((sum, price) => {
            return sum + price;
        });
    }

    //Si estaba cancelado y se reactiva, se eliminan las razones de cancelación
    if (this.getUpdate().cancelled == false) {
        this.getUpdate().cancelationReasons = undefined
    }


    next();
});


module.exports = mongoose.model('Trip', TripSchema);

