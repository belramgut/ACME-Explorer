'use strict';

var express = require('express'),
    app = express(),
    port = process.env.PORT || 8080,
    mongoose = require('mongoose'),
    Trip = require('./api/models/tripModel'),
    Application = require('./api/models/applicationModel'),
    Finder = require('./api/models/finderModel'),
    Config = require('./api/models/configModel'),
    Actor = require('./api/models/actorModel'),
    SponsorShip = require('./api/models/sponsorShipModel'),
    bodyParser = require('body-parser'),
    DataWareHouse = require('./api/models/dataWareHouseModel'), //created model loading here
    DataWareHouseTools = require('./api/controllers/dataWareHouseController'),
    admin = require('firebase-admin'),
    serviceAccount = require('./acme-explorer-83187-firebase-adminsdk-xiaqt-e3ecaaba50.json');


var mongoDBUser = process.env.mongoDBUser || "myUser";
var mongoDbPass = process.env.mongoDbPass || "myUserPassword";
var mongoDbCredentials = (mongoDBUser && mongoDbPass) ? mongoDBUser + ":" + mongoDbPass + "@" : "";
var mongoDBHostname = process.env.mongoDBHostname || "localhost";
var mongoDBPort = process.env.mongoDBPort || "27017";
var mongoDBName = process.env.mongoDBName || "acmeExplorer";
var mongoDBURI = "mongodb://" + mongoDbCredentials + mongoDBHostname + ":" + mongoDBPort + "/" + mongoDBName;

mongoose.connect(mongoDBURI, {
    reconnectTries: 10,
    reconnectInterval: 500,
    poolSize: 10, // Up to 10 sockets
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // skip trying IPv6
    useNewUrlParser: true,
    auth:{authdb:"admin"}
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routesTrips = require('./api/routes/tripRouter');
var routesApplication = require('./api/routes/applicationRouter');
var routesFinder = require('./api/routes/finderRouter');
var routesActor = require('./api/routes/actorRouter');
var routesSponsorShips = require('./api/routes/sponsorShipRouter');
var routesConfig = require('./api/routes/configRouter');
var routesDataWareHouse = require('./api/routes/dataWareHouseRoutes');
var routesLogin = require('./api/routes/loginRoutes');


var adminConfig = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://acme-explorer-83187.firebaseio.com'
};
admin.initializeApp(adminConfig);

routesTrips(app);
routesApplication(app);
routesFinder(app);
routesActor(app);
routesSponsorShips(app);
routesConfig(app);
routesDataWareHouse(app);
routesLogin(app);

console.log("Connecting DB to: " + mongoDBURI);
mongoose.connection.on("open", function (err, conn) {
    app.listen(port, function () {
        console.log('ACME-Explorer RESTful API server started on: ' + port);
    });
});

mongoose.connection.on("error", function (err, conn) {
    console.error("DB init error " + err);
});
DataWareHouseTools.createDataWareHouseJob();
