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

var hashed = function (password) {
  return new Promise(function (resolve, reject) {
    if (password) {
      var salt = bcrypt.genSaltSync(5);
      var hash = bcrypt.hashSync(password, salt);
      resolve(hash);
    } else {
      var error = new Error('no password');
      reject(error);
    }

  });
};

ActorSchema.pre('save', async function (callback) {
  var actor = this;
  hashed(actor.password).then(function (myhash) {
    actor.password = myhash;
    callback();
  })
});
ActorSchema.pre("findOneAndUpdate", async function (callback) {
  var actor = this;
  var password = this.getUpdate().password;
  hashed(password).then(function (myhash) {
    actor.update({ password: myhash })
    callback();
  })
});


ActorSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    console.log('verifying password in actorModel: ' + password);
    if (err) return cb(err);
    console.log('iMatch: ' + isMatch);
    cb(null, isMatch);
  });
};


module.exports = mongoose.model('Actor', ActorSchema);
