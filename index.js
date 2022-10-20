var DEFAULT_PORT = 5000;
var DEFAULT_HOST = "127.0.0.1";
var SERVER_NAME = "smarthealth";

var http = require("http");
var mongoose = require("mongoose");

var port = process.env.PORT;
var ipaddress = process.env.IP; // Must be changed to integrate heroku later.

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
// Add my Mongodb cloud connection string SmartHealth
var uristring =
  process.env.MONGODB_URI ||
  // "mongodb://127.0.0.1:27017/data";
  "mongodb+srv://Dicksen:DpdUTx1rJj9OHBPA@cluster0.gtbwvrx.mongodb.net/SmartHealth?retryWrites=true&w=majority";

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("!!!! Connected to db: " + uristring);
});

// This is the schema.  Note the types, validation and trim
// statements.  They enforce useful constraints on the data.
var patientSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  mobile_number: String,
  address: String,
  sex: String,
  date_of_birth: String,
});

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'Patients' collection in the MongoDB database
var Patient = mongoose.model("patients", patientSchema);

var errors = require("restify-errors");
var restify = require("restify"),
  // Create the restify server
  server = restify.createServer({ name: SERVER_NAME });

if (typeof ipaddress === "undefined") {
  //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
  //  allows us to run/test the app locally.
  console.warn("No process.env.IP var, using default: " + DEFAULT_HOST);
  ipaddress = DEFAULT_HOST;
}

if (typeof port === "undefined") {
  console.warn("No process.env.PORT var, using default port: " + DEFAULT_PORT);
  port = DEFAULT_PORT;
}

server.listen(port, ipaddress, function () {
  console.log("Server %s listening at %s", server.name, server.url);
  console.log("Resources:");
  console.log(" /patients");
  console.log(" /patients/:id");
});

server
  // Allow the use of POST
  .use(restify.plugins.fullResponse())

  // Maps req.body to req.params
  .use(restify.plugins.bodyParser());

// 1. Create a new patient with general information
server.post("/patients", function (req, res, next) {
  console.log("POST request: patient params=>" + JSON.stringify(req.params));
  console.log("POST request: patient body=>" + JSON.stringify(req.body));
  // Make sure name is defined
  if (req.body.first_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("first_name must be supplied"));
  }
  if (req.body.last_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("last_name must be supplied"));
  }

  // Creating new patient.
  var newPatient = new Patient({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    mobile_number: req.body.mobile_number,
    address: req.body.address,
    sex: req.body.sex,
    date_of_birth: req.body.date_of_birth,
  });

  // Create the patient and saving to db
  newPatient.save(function (error, result) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)));
    // Send the patient if no issues
    res.send(201, result);
  });
});
