'use strict';

module.exports = function (app) {
    var sponsorShip = require('../controllers/sponsorShipController');
 //only will be shown if are payed
     /**
   * Manage catalogue of sponsorShips: 
   * Get sponsorShips 
   *    RequiredRoles: Administrator
   *
   * @section sponsorShips
   * @type get 
   * @url /v1/sponsorShips
  */ 
    app.route('/v1/sponsorShips')
        .get(sponsorShip.list_all_sponsorShips);
    
    /*  
    app.route('/v1/sponsorShip/search') //checkactorsponsor-rol
        .get(sponsorShip.search_a_sponsorShip);
    
        
    app.route('/v1/sponsorShip/:idSponsorShip')
        .put(sponsorShip.update_a_sponsorShip)
        .delete(sponsorShip.delete_a_sponsorShip);

    app.route('/v1/sponsorShips') //checkactorsponsor-rol
        .post(sponsorShip.create_a_sponsorShip);
    */
};
