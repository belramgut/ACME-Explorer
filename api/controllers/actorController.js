'use strict';

var mongoose = require('mongoose'),
    Actor = mongoose.model('Actor');
var admin = require('firebase-admin');

exports.list_all_actors = function (req, res) {
    Actor.find({}, function (err, actors) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(actors);
        }
    });
};

exports.login_an_actor = async function(req, res) {
    console.log('starting login an actor');
    var emailParam = req.query.email;
    var password = req.query.password;
    Actor.findOne({ email: emailParam }, function (err, actor) {
        if (err) { res.send(err); }
  
        // No actor found with that email as username
        else if (!actor) {
          res.status(401); //an access token isn’t provided, or is invalid
          res.json({message: 'forbidden',error: err});
        }
  
        else if (actor.banned == true) {
          res.status(403); //an access token is valid, but banned
          res.json({message: 'forbidden',error: err});
        }
        else{
          // Make sure the password is correct
          //console.log('En actor Controller pass: '+password);
          actor.verifyPassword(password, async function(err, isMatch) {
            if (err) {
              res.send(err);
            }
  
            // Password did not match
            else if (!isMatch) {
              //res.send(err);
              res.status(401); //an access token isn’t provided, or is invalid
              res.json({message: 'forbidden',error: err});
            }
  
            else {
                try{
                  var customToken = await admin.auth().createCustomToken(actor.email);
                } catch (error){
                  console.log("Error creating custom token:", error);
                }
                actor.customToken = customToken;
                console.log('Login Success... sending JSON with custom token');
                res.json(actor);
            }
        });
      }
    });
  };

//check administrator actor rol
exports.create_an_actor = function (req, res) {
    var new_actor = new Actor(req.body);

    new_actor.save(function (error, actor) {
        if (error) {
            res.send(error);
        }
        else {
            res.json(actor);
        }
    });
};
//check administrator actor rol
exports.read_an_actor = function (req, res) {
    Actor.findById(req.params.actorId, function (err, actor) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(actor);
        }
    });
};

//check administrator actor rol
exports.update_an_actor = function (req, res) {
    Actor.findById(req.params.actorId, function (err, actor) {
        if (err) {
            res.send(err);
        } else {
            var new_actor = req.body;

            if (new_actor.phone.length != 9) {
                res.status(422).send({ message: 'Phone number es incorrect' });
            } else {
                Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                    runValidators: true,
                    context: 'query'
                }, function (err, actor) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.json(actor);
                    }
                });
            }
        }
        });
};
//check administrator actor rol
exports.delete_an_actor = function (req, res) {
    Actor.remove({
        _id: req.params.actorId
    }, function (err, actor) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({ message: 'actor successfully deleted' });
        }
    });
};
