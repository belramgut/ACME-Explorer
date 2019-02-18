'use strict';

module.exports = function (app) {
var actor = require('../controllers/actorController');
  /**
   * Get  actors
   *    Required role: Administrator
   * Post an actor 
   *    RequiredRoles: Administrator
   *    
   *
    * @section actors
	 * @type get post
	 * @url /v1/actors
**/
    app.route('/v1/actors')
        .get(actor.list_all_actors)
        .post(actor.create_an_actor)
/**
   * Put an actor
   *    RequiredRoles: to be the proper actor
   * Get an actor
   *    RequiredRoles: to be the proper actor or an Administrator
   * Delete an actor
   * RequiredRoles: to be the proper actor or an Administrator
	 *
	 * @section actors
	 * @type get put delete
	 * @url /v1/actors/:actorId
  */  
    app.route('/v1/actors/:actorId')
        .get(actor.read_an_actor)
        .put(actor.update_an_actor)
        .delete(actor.delete_an_actor);
};
