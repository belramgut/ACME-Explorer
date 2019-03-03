var async = require("async");
var mongoose = require('mongoose'),
  DataWareHouse = mongoose.model('DataWareHouse'),
  Trips = mongoose.model('Trip'),
  Finder = mongoose.model('Finder'),
  Applications = mongoose.model('Application');


exports.list_all_indicators = function (req, res) {
  console.log('Requesting indicators');

  DataWareHouse.find().sort("-computationMoment").exec(function (err, indicators) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(indicators);
    }
  });
};

exports.last_indicator = function (req, res) {

  DataWareHouse.find().sort("-computationMoment").limit(1).exec(function (err, indicators) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(indicators);
    }
  });
};

var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;

//'0 0 * * * *' una hora
//'*/30 * * * * *' cada 30 segundos
//'*/10 * * * * *' cada 10 segundos
//'* * * * * *' cada segundo
var rebuildPeriod = '*/10 * * * * *';  //El que se usará por defecto
var computeDataWareHouseJob;

exports.rebuildPeriod = function (req, res) {
  console.log('Updating rebuild period. Request: period:' + req.query.rebuildPeriod);
  rebuildPeriod = req.query.rebuildPeriod;
  computeDataWareHouseJob.setTime(new CronTime(rebuildPeriod));
  computeDataWareHouseJob.start();

  res.json(req.query.rebuildPeriod);
};

function createDataWareHouseJob() {
  computeDataWareHouseJob = new CronJob(rebuildPeriod, function () {

    var new_dataWareHouse = new DataWareHouse();
    console.log('Cron job submitted. Rebuild period: ' + rebuildPeriod);
    async.parallel([
      computeavgMinMaxStdvTripsPerManager,
      computeavgMinMaxStdvApplicationsPerTrip,
      computeratioApplicationsGroupedByStatus,
      computeAvgRangeFinder,
      computeTopKeywords
    ], function (err, results) {
      if (err) {
        console.log("Error computing datawarehouse: " + err);
      }
      else {
        console.log("Resultados obtenidos por las agregaciones: "+JSON.stringify(results));
        new_dataWareHouse.avgMinMaxStdvTripsPerManager = results[0];
        new_dataWareHouse.avgMinMaxStdvApplicationsPerTrip = results[1];
        new_dataWareHouse.ratioApplicationsGroupedByStatus = results[2];
        new_dataWareHouse.avgRangeFinder = results[3];
        new_dataWareHouse.topKeywords = results[4];
        new_dataWareHouse.rebuildPeriod = rebuildPeriod;

        new_dataWareHouse.save(function (err, datawarehouse) {
          if (err) {
            console.log("Error saving datawarehouse: " + err);
          }
          else {
            console.log("new DataWareHouse succesfully saved. Date: " + new Date());
          }
        });
      }
    });
  }, null, true, 'Europe/Madrid');
}

module.exports.createDataWareHouseJob = createDataWareHouseJob;

function computeavgMinMaxStdvTripsPerManager(callback) {
  Trips.aggregate([

    { $group: { _id: "$manager", tripsManaged: { $sum: 1 } } },
    { $group: { _id: 0, avg: { $avg: "$tripsManaged" }, min: { $min: "$tripsManaged" }, max: { $max: "$tripsManaged" }, stdev: { $stdDevPop: "$tripsManaged" } } },
    { $project: { _id: 0, avg: 1, min: 1, max: 1, stdev: 1 } },
    { $group: { _id: null, resultados: { $push: { avg: "$avg", min: "$min", max: "$max", stdev: "$stdev" } } } }
  ], function (err, res) {
    callback(err, res[0].resultados);
  });
};

function computeavgMinMaxStdvApplicationsPerTrip(callback) {
  Applications.aggregate([
    { $group: { _id: "$trip", tripsApplicated: { $sum: 1 } } },
    {
      $group: {
        _id: 0, avg: { $avg: "$tripsApplicated" }, min: { $min: "$tripsApplicated" },
        max: { $max: "$tripsApplicated" }, stdev: { $stdDevPop: "$tripsApplicated" }
      }
    },
    { $project: { _id: 0, avg: 1, min: 1, max: 1, stdev: 1 } },
    { $group: { _id: null, resultados: { $push: { avg: "$avg", min: "$min", max: "$max", stdev: "$stdev" } } } }
  ], function (err, res) {
    callback(err, res[0].resultados);
  });
}

function computeratioApplicationsGroupedByStatus(callback) {
  Applications.aggregate([
    {
      $facet: {
        grandTotal: [{ $group: { _id: null, totalapps: { $sum: 1 } } }],
        groups: [{ $group: { _id: "$status", total: { $sum: 1 } } }],
      }
    },
    { $project: { _id: 0, groupsTotal: "$groups", grandTotal: "$grandTotal.totalapps" } },
    { $unwind: "$grandTotal" },
    { $unwind: "$groupsTotal" },
    { $project: { _id: 0, status: "$groupsTotal._id", ratio: { $divide: ["$groupsTotal.total", "$grandTotal"] } } },
    { $unwind: "$status" },
    { $group: { _id: null, resultados: { $push: { status: "$status", ratio: "$ratio" } } } }
  ], function (err, res) {
    callback(err, res[0].resultados);
  });
}

function computeAvgRangeFinder(callback) {
  Finder.aggregate([
    {"$project": {"_id":0, "range": {"$subtract": ["$higherPrice", "$lowerPrice"]}}}, 
    {"$group": {"_id": 0, "avgRange": {"$avg": "$range"}}},
    {"$project": {"_id":0, "avgRange": 1}}
    ], function (err, res) {
    callback(err, res[0].avgRange);
  });
}

function computeTopKeywords(callback) {
  Finder.aggregate([
    {"$project": {"_id":0, "keyword": {$toLower: "$keyword"}}},
    {"$group": {"_id": "$keyword", "count": {"$sum": 1}}},
    { "$sort" : { count : -1} },
    { "$limit" : 10 }
    ], function (err, res) {

    var keywords = [];

    for (var i in res) {
      keywords.push(res[i]._id);
    }

    callback(err, keywords);
  });
}