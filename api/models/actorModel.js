'use strict';

//importancion moongose
var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var ActorSchema= new Schema({
 name:{
     type:String,
     required:'Kindly enter the actor name'
 },
 surname:{
    type:String,
    required:'Kindly enter the actor surname'
 },
 email:{
    type:String,
    required:'Kindly enter the actor email'
  },
  password:{
    type:String,
    required:'Kindly enter the actor password'
  },
  preferredLanguaje:{
     type:String,
     default:'en'
  },
  phoneNumber:{
    type:String,
  },
  addres:{
      type:String,
  },
  photo:{
       data: Buffer, 
       contenntType:String
  },
  actorType:[{
      type:String, 
      required:'Kindly enter the actor type',
      enum:['ADMINISTRATOR', 'MANAGER', 'EXPLORER','SPONSOR']

  }],
  created: {
      type:Date,
      default:Date.now
  },
  banned:{
      type: Boolean,
      default: false,
  }
  
},

{strict:false}); //puede recibir cosas que no estan en el modelo

module.exports=mongoose.model('Actor', ActorSchema);
