'use strict';

module.exports = function (app) {
    var trip = require('../controllers/tripController');
    var authController = require('../controllers/authController');

    /**
     * Get all trips
     *      RequiredRoles: any
     * Post a trip
     *      RequiredRoles: Manager
     * 
     * @section trips
     * @type get post
     * @url /v1/trips
     */
    app.route('/v1/trips')
        .get(trip.list_all_trips)
        .post(trip.create_a_trip);

    /**
     * Search engine for trips
     * Get trips depending on params
     *      RequiredRoles: any
     * 
     * @section trips
     * @type get
     * @url /v1/trips/search
     * @param {string} keyword
     */
    app.route('/v1/trips/search')
        .get(trip.search_by_keyword);

    /**
     * Get a specific trip
     *      RequiredRoles: any
     * Put a trip
     *      RequiredRoles: be the manager who owns it
     * Delete a trip
     *      RequiredRoles: be the manager who owns it
     * 
     * @section trips
     * @type get put delete
     * @url /v1/trips/:tripId
     */
    app.route('/v1/trips/:tripId')
        .get(trip.read_a_trip)
        .put(trip.update_a_trip)
        .delete(trip.delete_a_trip);


    app.route('/v2/mytrips')
        .get(authController.verifyUser(["MANAGER"]), trip.list_all_trips);

    app.route('/v2/mytrips/:tripId')
        .get(authController.verifyUser(["MANAGER"]), trip.read_a_trip);

    app.route('/v2/trips')
        .get(trip.list_all_trips)
        .post(authController.verifyUser(["MANAGER"]), trip.create_a_trip);

    app.route('/v2/trips/search')
        .get(trip.search_by_keyword);

    app.route('/v2/trips/:tripId')
        .get(trip.read_a_trip)
        .put(authController.verifyUser(["MANAGER"]), trip.update_a_trip)
        .delete(authController.verifyUser(["MANAGER"]), trip.delete_a_trip);

};
