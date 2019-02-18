var mongoose = require('mongoose');
require('mongoose-type-url');
var Schema = mongoose.Schema;
const validator= require('validator');
Actor = mongoose.model('Actor');

var SponsorShipSchema = new Schema({

    banner: {
        data: Buffer,
        contenntType: String
    },
    landingPage: {
        type: String,
        requied: 'Kindly enter the landing page',
        validate: { 
            validator: value => validator.isURL(value, { protocols: ['http','https','ftp'], require_tld: true, require_protocol: true }),
            message: 'Must be a Valid URL' 
          }
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
},{strict:false}); //puede recibir cosas que no estan en el modelo

SponsorShipSchema.pre('save', async function (callback) {
    //buscar el actor por el item
    //comprobar que tiene el flat_rate a true si true payed true
    
   var sponsorship =Actor.findById({_id:this.sponsor}, function (err, sponsor) {
       
        if (sponsor.flat_rate) {
            console.log("Flat rate true then sponsor ship is payed");
            sponsorship.updateOne({$set:{payed:true}});
        }else{
            console.log("Flat rate false then sponsor ship is not payed");
        }
    
    console.log(sponsorship.payed);
    callback();
});  
});




module.exports = mongoose.model('SponsorShip', SponsorShipSchema);