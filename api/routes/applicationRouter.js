'use strict';

module.exports = function (app) {
    var application = require('../controllers/applicationController');

    app.route('/applications')
        .get(application.list_all_applications)
        .post(application.create_an_application);

    app.route('/application/:applicationId')
        .get(application.read_an_application)
        .put(application.update_an_application)
        .delete(application.delete_an_application);
};
