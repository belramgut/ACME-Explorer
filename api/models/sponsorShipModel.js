var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SponsorShipSchema= new Schema({

    banner: {
        data: Buffer, 
        contenntType:String
    },
    landingPage:{
        type: String,
        requied:'Kindly enter the landing page'
    },
    payed:{
        type: Boolean,
        default: false
    },
    sponsor:{
        type: Schema.Types.ObjectId,
        ref: 'Actor'
    },
    trip:{
        type: Schema.Types.ObjectId,
        ref: 'Trip'
    }
})


module.exports = mongoose.model('SponsorShip', SponsorShipSchema);

