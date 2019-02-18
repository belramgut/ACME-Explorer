'use strict';

var mongoose = require('mongoose'),
Actor = mongoose.model('Actor');

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
        }
        else {
            Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(actor);
                }
            });
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
