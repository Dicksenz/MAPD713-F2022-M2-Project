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
