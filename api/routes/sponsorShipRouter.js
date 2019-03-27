'use strict';

module.exports = function (app) {
    var sponsorShip = require('../controllers/sponsorShipController');
    var authController = require('../controllers/authController');
    
    /**
     * Get a sponsorShip
     *      RequiredRoles: be the sponsor  who owns it
     * 
     * @section sponsorShip
     * @type  get
     * @url /v1/sponsorShip/search?actorId=5c6a7f69d2093f1cec42478f

     */

    app.route('/v1/sponsorShips/search') //checkactorsponsor-rol
        .get(sponsorShip.search_a_sponsorShip);
    
    app.route('/v2/sponsorShips/search') //checkactorsponsor-rol
        .get(authController.verifyUser(["SPONSOR"]),sponsorShip.search_a_sponsorShip);
        

    /**
     * Put a sponsorShip
     *      RequiredRoles: be the sponsor  who owns it
     * Delete a trip
     *      RequiredRoles: be the sponsor who owns it
     * 
     * @section sponsorShip
     * @type  put delete
     * @url /v1/sponsorShip/:sponsorShipId
     * @param {String} sponsorShipId
     */

    app.route('/v1/sponsorShips/:sponsorShipId')//checkactorsponsor-rol
        .put(sponsorShip.update_a_sponsorShip)
        .delete(sponsorShip.delete_a_sponsorShip);

    app.route('/v2/sponsorShips/:sponsorShipId')//checkactorsponsor-rol
        .put(authController.verifyUser(["SPONSOR"]),sponsorShip.update_a_sponsorShip)
        .delete(authController.verifyUser(["SPONSOR"]),sponsorShip.delete_a_sponsorShip);


    /**
     * Post a sponsorShip
     *      RequiredRoles: be the sponsor  who owns it
     * 
     * @section sponsorShip
     * @type  post
     * @url /v1/sponsorShip/:sponsorShipId
     * 
     */

    app.route('/v1/sponsorShips') //checkactorsponsor-rol
        .post(sponsorShip.create_a_sponsorShip);

    app.route('/v2/sponsorShips') //checkactorsponsor-rol
        .post(authController.verifyUser(["SPONSOR"]), sponsorShip.create_a_sponsorShip);

};
