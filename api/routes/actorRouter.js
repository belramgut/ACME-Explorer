'use strict';

module.exports = function (app) {
    var actor = require('../controllers/actorController');

    app.route('/v1/actors')
        .get(actor.list_all_actors)
        .post(actor.create_an_actor)

    app.route('/v1/actors/:idActor')
        .get(actor.read_an_actor)
        .put(actor.update_an_actor)
        .delete(actor.delete_an_actor);
};
