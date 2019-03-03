'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DataWareHouseSchema = new mongoose.Schema({
  //input aggregates
  /*
1. The average, the minimum, the maximum, and the standard deviation of the number of trips per manager.
2. The average, the minimum, the maximum, and the standard deviation of the number of applications per trip.
3. The average, the minimum, the maximum, and the standard deviation of the number of the price og the trips.
4. The ratio of applications grouped by status.
6. The average price range that explorers indicate in their finders.
7. The top 10 key words that the explorers indicate in their finders.

*/

  avgMinMaxStdvTripsPerManager: [{
    type: Schema.Types.Array
  }],
  avgMinMaxStdvApplicationsPerTrip: [{
    type: Schema.Types.Array
  }],
  ratioApplicationsGroupedByStatus: [{
    type: Schema.Types.Array
  }],
  topKeywords: [String],
  avgRangeFinder: {type: Number},
  computationMoment: {
    type: Date,
    default: Date.now
  },
  rebuildPeriod: {
    type: String
  }
}, { strict: false });

DataWareHouseSchema.index({ computationMoment: -1 });

module.exports = mongoose.model('DataWareHouse', DataWareHouseSchema);
