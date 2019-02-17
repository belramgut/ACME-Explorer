'use strict';

module.exports = function (app) {
    var application = require('../controllers/applicationController');

    app.route('/v1/applications/search')
        .get(application.search_applications);

    app.route('/v1/applications')
        .post(application.create_an_application);

    app.route('/v1/application/:applicationId')
        .get(application.read_an_application)
        .put(application.update_an_application)
        .delete(application.delete_an_application);
};
