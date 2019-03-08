'use strict';

//importancion moongose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator = require('validator');
var bcrypt = require('bcrypt');
var crypto = require('crypto');

var ActorSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the actor name'
  },
  surname: {
    type: String,
    required: 'Kindly enter the actor surname'
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    validate: {
      validator: email => validator.isEmail(email),
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: 'Kindly enter the actor password'
  },
  customToken: {
    type: String
  },
  preferredLanguaje: {
    type: String,
    default: 'en'
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
        var re = /^\d{9}$/;
        return (v == null || v.trim().length < 1) || re.test(v)
      },
      message: 'Provided phone number is invalid.'
    }
  },
  address: {
    type: String,
  },
  photo: {
    data: Buffer,
    contenntType: String
  },
  actorType: [{
    type: String,
    required: 'Kindly enter the actor type',
    enum: ['ADMINISTRATOR', 'MANAGER', 'EXPLORER', 'SPONSOR']

  }],
  created: {
    type: Date,
    default: Date.now
  },
  banned: {
    type: Boolean,
    default: false,
  },
  flat_rate: {
    type: Boolean,
    default: false,
  }
},

  { strict: false }); //puede recibir cosas que no estan en el modelo
ActorSchema.pre('save', function (callback) {
  console.log("todo recibida", this);
  var actor = this;
  // Break out if the password hasn't changed
  if (!actor.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function (err, salt) {
    if (err) return callback(err);

    bcrypt.hash(actor.password, salt, function (err, hash) {
      if (err) return callback(err);
      actor.password = hash;
      callback();
    });
  });
});
ActorSchema.pre("findOneAndUpdate", function (callback) {
   var password = this.getUpdate().password;
   var actor=this;
  console.log("contrasena recibida", password);
  if (!password) return callback();

  bcrypt.genSalt(5, function (err, salt) {
    if (err) return callback(err);

    bcrypt.hash(password, salt, function (err, hash) {
      
      if (err) return callback(err);
      actor.update({password:hash});      
      callback();      
      console.log("contrasena hasheada", hash);
    });
  });
});

//cojo la password del body
//la encripto
//se la meto con un $set al campo password



ActorSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    console.log('verifying password in actorModel: ' + password);
    if (err) return cb(err);
    console.log('iMatch: ' + isMatch);
    cb(null, isMatch);
  });
};


module.exports = mongoose.model('Actor', ActorSchema);
