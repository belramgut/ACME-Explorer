'use strict';

module.exports = function (app) {
    var application = require('../controllers/applicationController');
    var authController = require('../controllers/authController');

    app.route('/v1/applications/search')
        .get(application.search_applications);

    app.route('/v1/applications')
        .post(application.create_an_application);
    
    app.route('/v2/applications')
        .post(authController.verifyUser(["EXPLORER"]),  application.create_an_application);

    app.route('/v1/applications/:applicationId')
        .get(application.read_an_application)
        .put(application.update_an_application)
        .delete(application.delete_an_application);
    
    app.route('/v2/applications/:applicationId')
        .get(authController.verifyUser(["EXPLORER", "MANAGER"]), application.read_an_application)
        .put(authController.verifyUser(["EXPLORER", "MANAGER"]), application.update_an_application)
        .delete(authController.verifyUser(["EXPLORER", "MANAGER"]), application.delete_an_application);
};
