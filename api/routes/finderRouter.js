'use strict';

module.exports = function (app) {
    var finder = require('../controllers/finderController');
    var authController = require('../controllers/authController');

    app.route('/v1/finders/search')
        .get(finder.search_finders);

    app.route('/v1/finders')
        .post(finder.create_a_finder);

    app.route('/v1/finders/:finderId')
        .delete(finder.delete_an_finder)
        .put(finder.update_a_finder);
        
    app.route('/v1/finders/:finderId/apply_search')
        .get(finder.apply_search);
    
    
    app.route('/v2/finders/search')
        .get(authController.verifyUser(["EXPLORER"]),  finder.search_finders);

    app.route('/v2/finders')
        .post(authController.verifyUser(["EXPLORER"]),  finder.create_a_finder);

    app.route('/v2/finders/:finderId')
        .delete(authController.verifyUser(["EXPLORER"]),  finder.delete_an_finder)
        .put(authController.verifyUser(["EXPLORER"]),  finder.update_a_finder);
        
    app.route('/v2/finders/:finderId/apply_search')
        .get(authController.verifyUser(["EXPLORER"]),  finder.apply_search);
};
