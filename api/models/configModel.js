'use strict';

//importancion moongose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ConfigSchema = new Schema({
  flat_rate: {
    type: Number,
    default: 1000,
    min: 0,
    required: 'Kindly enter the flat rate'
  },
  max_result_finders: {
    type: Number,
    default: 10,
    min: 0,
    max: 100,
    required: 'Kindly enter the max result for a finder'
  }
},

  { strict: false }); //puede recibir cosas que no estan en el modelo

module.exports = mongoose.model('Config', ConfigSchema);
