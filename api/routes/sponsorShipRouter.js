'use strict';

module.exports = function (app) {
    var sponsorShip = require('../controllers/sponsorShipController');
 //only will be shown if are payed

 
    /**
     * Get a sponsorShip
     *      RequiredRoles: be the sponsor  who owns it
     * 
     * @section sponsorShip
     * @type  get
     * @url /v1/sponsorShip/search/:sponsorShipId
     */
      
    app.route('/v1/sponsorShip/search/:sponsorShipId') //checkactorsponsor-rol
        .get(sponsorShip.search_a_sponsorShip);
    
    /**
     * Put a sponsorShip
     *      RequiredRoles: be the sponsor  who owns it
     * Delete a trip
     *      RequiredRoles: be the sponsor who owns it
     * 
     * @section sponsorShip
     * @type  put delete
     * @url /v1/sponsorShip/:sponsorShipId
     */
        
    app.route('/v1/sponsorShip/:sponsorShipId')
        .put(sponsorShip.update_a_sponsorShip)
        .delete(sponsorShip.delete_a_sponsorShip);


    /**
     * Post a sponsorShip
     *      RequiredRoles: be the sponsor  who owns it
     * 
     * @section sponsorShip
     * @type  post
     * @url /v1/sponsorShip/:sponsorShipId
     */

    app.route('/v1/sponsorShips') //checkactorsponsor-rol
        .post(sponsorShip.create_a_sponsorShip);
    
};
