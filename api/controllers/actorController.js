'use strict';

var mongoose = require('mongoose'),
    Actor = mongoose.model('Actor');
var admin = require('firebase-admin');
var authController = require('./authController');

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

exports.login_an_actor = async function (req, res) {
    console.log('starting login an actor');
    var emailParam = req.query.email;
    var password = req.query.password;
    Actor.findOne({ email: emailParam }, function (err, actor) {
        if (err) { res.send(err); }

        // No actor found with that email as username
        else if (!actor) {
            res.status(401); //an access token isn’t provided, or is invalid
            res.json({ message: 'forbidden', error: err });
        }

        else if (actor.banned == true) {
            res.status(403); //an access token is valid, but banned
            res.json({ message: 'forbidden', error: err });
        }
        else {
            // Make sure the password is correct
            //console.log('En actor Controller pass: '+password);
            actor.verifyPassword(password, async function (err, isMatch) {
                if (err) {
                    res.send(err);
                }

                // Password did not match
                else if (!isMatch) {
                    //res.send(err);
                    res.status(401); //an access token isn’t provided, or is invalid
                    res.json({ message: 'forbidden', error: err });
                }

                else {
                    try {
                        var customToken = await admin.auth().createCustomToken(actor.email);
                    } catch (error) {
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
    if (new_actor.phoneNumber.length != 9) {
        res.status(422).send({ message: 'Phone number es incorrect' });
    } else {

    new_actor.save(function (error, actor) {
        if (error) {
            res.send(error);
        }
        else {
            res.json(actor);
        }
    });
    }
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

            if (new_actor.phoneNumber.length != 9) {
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

exports.update_an_actor2 = function (req, res) {
    Actor.findById(req.params.actorId, async function (err, actor) {
        if (err) {
            res.send(err);
        }
        else {
            console.log('actor: ' + actor);
            var idToken = req.headers['idtoken'];//WE NEED the FireBase custom token in the req.header['idToken']... it is created by FireBase!!
            if (actor.actorType.includes('MANAGER') || actor.actorType.includes('EXPLORER') || actor.actorType.includes('SPONSOR')) {
                var authenticatedUserId = await authController.getUserId(idToken);
                if (authenticatedUserId == req.params.actorId) {
                    Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
                        if (err) {
                            res.send(err);
                        }
                        else {
                            res.json(actor);
                        }
                    });
                } else {
                    res.status(403); //Auth error
                    res.send('The Actor is trying to update an Actor that is not himself!');
                }
            } else if (actor.role.includes('ADMINISTRATOR')) {
                Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.json(actor);
                    }
                });
            } else {
                res.status(405); //Not allowed
                res.send('The Actor has unidentified roles');
            }
        }
    });

};

exports.validate_an_actor = function (req, res) {
    //Check that the user is an Administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
    console.log("Validating an actor with id: " + req.params.actorId)
    Actor.findOneAndUpdate({ _id: req.params.actorId }, { $set: { "validated": "true" } }, { new: true }, function (err, actor) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.json(actor);
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
