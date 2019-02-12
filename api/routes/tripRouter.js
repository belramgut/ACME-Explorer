'use strict';

module.exports = function (app) {
    var trip = require('../controllers/tripController');

    app.route('/v1/trips')
        .get(trip.list_all_trips)
        .post(trip.create_a_trip);

    app.route('/v1/trips/:tripId')
        .get(trip.read_a_trip)
        .put(trip.update_a_trip)
        .delete(trip.delete_a_trip);
};
