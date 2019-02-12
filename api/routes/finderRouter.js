'use strict';

module.exports = function (app) {
    var finder = require('../controllers/finderController');

    app.route('/v1/finders/search')
        .get(finder.search_finders)

    app.route('/v1/finders')
        .post(finder.create_a_finder);

    app.route('/v1/finders/:finderId')
        .delete(finder.delete_an_finder)
        .put(finder.update_a_finder)
};
