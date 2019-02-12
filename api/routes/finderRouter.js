'use strict';

module.exports = function (app) {
    var finder = require('../controllers/finderController');

    app.route('/v1/finders')
        .get(finder.list_all_finders)
        .post(finder.create_a_finder);

    app.route('/v1/finders/:finderId')
        .get(finder.read_a_finder)
        .put(finder.update_a_finder)
        .delete(finder.delete_an_finder);
};
