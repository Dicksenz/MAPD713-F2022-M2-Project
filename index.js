var DEFAULT_PORT = 5000;
var DEFAULT_HOST = "127.0.0.1";
var SERVER_NAME = "smarthealth";

var http = require("http");
var mongoose = require("mongoose");
const { pid } = require("process");

var port = process.env.PORT || 5000;
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

// Patient clinical test schema
var patientClinicalTestSchema = new mongoose.Schema({
  patient_id: String,
  category: String,
  date: String,
  nurse_name: String,
  readings: {},
});

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'Patients' collection in the MongoDB database
var Patient = mongoose.model("patients", patientSchema);
var Test = mongoose.model("tests", patientClinicalTestSchema);

var errors = require("restify-errors");
var restify = require("restify"),
  // Create the restify server
  server = restify.createServer({ name: SERVER_NAME });

if (typeof ipaddress === "undefined") {
  //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
  //  allows us to run/test the app locally.
  console.warn("No process.env.IP var, using default: " + DEFAULT_HOST);
  ipaddress = DEFAULT_HOST;
} else {
  ipaddress = "test";
}

if (typeof port === "undefined") {
  console.warn("No process.env.PORT var, using default port: " + DEFAULT_PORT);
  port = DEFAULT_PORT;
}

// Remove ipaddressfrom the server listen function for heroku to work.
server.listen(port, function () {
  // I had to remove ipaddress as heroku does not work with that.
  console.log(
    "Server %s listening at %s",
    server.name,
    "http://127.0.0.1:5000"
  );
  console.log("Resources:");
  console.log(" /patients");
  console.log(" /patients/:id");
});

server
  // Allow the use of POST
  .use(restify.plugins.fullResponse())

  // Maps req.body to req.params
  .use(restify.plugins.bodyParser());

server.get("/", function (req, res, next) {
  res.send({ message: "ok" });
});

// Use case 1. Create a new patient with general information
server.post("/patients", function (req, res, next) {
  console.log("POST request: patients params=>" + JSON.stringify(req.params));
  console.log("POST request: patients body=>" + JSON.stringify(req.body));
  // Make sure name is defined
  if (req.body.first_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("first_name must be supplied"));
  }
  if (req.body.last_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("last_name must be supplied"));
  }
  if (req.body.email === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("email must be supplied"));
  }
  if (req.body.mobile_number === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("mobile number must be supplied"));
  }
  if (req.body.address === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("address must be supplied"));
  }
  if (req.body.sex === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("sex must be supplied"));
  }
  if (req.body.date_of_birth === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("date of birth must be supplied"));
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

// Use case 2. Get all patients in the system
server.get("/patients", function (req, res, next) {
  console.log("GET request: patients");
  // Find every entity within the given collection
  Patient.find({}).exec(function (error, result) {
    if (error) return next(new Error(JSON.stringify(error.errors)));
    res.send(result);
  });
});

// Use case 3. Get a single patient by their patient id
server.get("/patients/:id", function (req, res, next) {
  console.log("GET request: patients/" + req.params.id);

  // Find a single patient by their id
  Patient.find({ _id: req.params.id }).exec(function (error, patient) {
    if (patient) {
      // Send the patient if no issues
      res.send(patient);
    } else {
      // Send 404 header if the patient doesn't exist
      res.send(404);
    }
  });
});

// Milestone 3
// Use case 4, Add clinical test for a patient by their patient id
server.post("/patients/:id/tests", function (req, res, next) {
  console.log("POST request: patients/" + req.params.id + "/tests");
  console.log("POST request: patient params=>" + JSON.stringify(req.params));
  console.log("POST request: patient body=>" + JSON.stringify(req.body));
  // Make sure name is defined
  if (req.body.category === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("category must be supplied"));
  }
  if (req.body.date === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("date must be supplied"));
  }
  if (req.body.nurse_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("nurse name must be supplied"));
  }
  if (req.body.readings === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("readings name must be supplied"));
  }
  if (req.params.id === undefined || req.params.id === "") {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("id must be supplied"));
  }

  // Creating new test.
  var newTest = new Test({
    patient_id: req.params.id,
    category: req.body.category,
    date: req.body.date,
    nurse_name: req.body.nurse_name,
    readings: req.body.readings,
  });

  // Create the test and saving to db
  newTest.save(function (error, result) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)));
    // Send the patient if no issues
    res.send(201, result);
  });
});

// Use case 5. Get list of tests records of a patient by their id
server.get("/patients/:id/tests", function (req, res, next) {
  console.log("GET request: patients/" + req.params.id + "/tests");

  // Find all tests records of a patient by their id
  Test.find({ patient_id: req.params.id }).exec(function (error, test) {
    if (test) {
      // Send the patient if no issues
      res.send(test);
    } else {
      // Send 404 header if the patient doesn't exist
      res.send(404);
    }
  });
});

// Use case 6. Get a single clinical detail of a patient by their patient id and test id.
server.get("/patients/:patientid/tests/:testid", function (req, res, next) {
  console.log("GET request: patients/" + req.params.id + "/tests");

  // Find all tests records of a patient by their id
  Test.find({ patient_id: req.params.patientid, _id: req.params.testid }).exec(
    function (error, test) {
      if (test) {
        // Send the patient if no issues
        res.send(test[0]);
      } else {
        // Send 404 header if the patient doesn't exist
        res.send(404);
      }
    }
  );
});

// Use case 7. get list of patients with critical conditions.
server.get("/patients/conditions", async function (req, res, next) {
  console.log("GET request: patients/conditions");
  var pIdLow = [];
  var pIdHigh = [];

  var finalRes = [];
  var dateTestedLow;
  var dateTestedHigh;
  var testIdLow;
  var testIdHigh;

  await Test.find({})
    .then(async (data) => {
      await data.map((d, k) => {
        if (!("isVisible" in d.readings)) {
          if (d.readings.systolic < 70 || d.readings.diastolic < 60) {
            pIdLow.push(d.patient_id);
            dateTestedLow = d.date;
            testIdLow = d._id;
          }

          if (d.readings.systolic > 120 || d.readings.diastolic > 80) {
            pIdHigh.push(d.patient_id);
            dateTestedHigh = d.date;
            testIdHigh = d._id;
            console.log("High");
          }
        }
      });

      await Patient.find({ _id: { $in: pIdHigh } })
        .then((data) => {
          data.map((e) => {
            // Create custom json object.
            finalRes.push({
              _id: e._id,
              test_id: testIdHigh,
              date_tested: dateTestedHigh,
              first_name: e.first_name,
              last_name: e.last_name,
              sex: e.sex,
              date_of_birth: e.date_of_birth,
              conditions: ["Blood pressure high"],
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });

      await Patient.find({ _id: { $in: pIdLow } })
        .then((data) => {
          data.map((e) => {
            // Create custom json object.
            finalRes.push({
              _id: e._id,
              test_id: testIdLow,
              date_tested: dateTestedLow,
              first_name: e.first_name,
              last_name: e.last_name,
              sex: e.sex,
              date_of_birth: e.date_of_birth,
              conditions: ["Blood pressure low"],
            });
          });

          res.send(finalRes);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

//Use case 8. Delete patient with the given id
server.del("/patients/:id", function (req, res, next) {
  console.log("DEL request: patients/" + req.params.id);
  Patient.remove({ _id: req.params.id }, function (error, result) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)));

    // Send a 200 OK response
    res.send();
  });
});

// Please ignore this part its just for practice.
// It is for testing only and it is not for this assignment requirement.
server.post("/patients/:id/tests/:testid/fix", async function (req, res, next) {
  await Test.find({ patient_id: req.params.id, _id: req.params.testid }).exec(
    function (error, test) {
      if (test) {
        //create duplicate test
        var newTest = new Test({
          patient_id: req.params.id,
          category: test[0].category,
          date: test[0].date,
          nurse_name: test[0].nurse_name,
          readings: {
            isVisible: false,
            systolic: test[0].readings.systolic,
            diastolic: test[0].readings.diastolic,
          },
        });

        // Create the test and saving to db
        newTest.save(function (error, result) {});
      }
    }
  );

  // Creating new test.
  var newTest2 = new Test({
    patient_id: req.params.id,
    category: req.body.category,
    date: req.body.date,
    nurse_name: req.body.nurse_name,
    readings: req.body.readings,
  });

  // Create the test and saving to db
  await newTest2.save(function (error, result) {});

  await Test.deleteOne({ _id: req.params.testid }, function (error, result) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)));

    // Send a 200 OK response
    res.send();
  });
});
