'use strict';

module.exports = function (app) {
    var config = require('../controllers/configController');

    app.route('/v1/configs')
        .get(config.get_config);


    app.route('/v1/configs/:configId')
        .put(config.update_a_config);
};
