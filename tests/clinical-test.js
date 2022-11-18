//This is API testing file to test create clinical test record for a patient,
// Get all clinical records of a patient by their patient id and
//Get a patient general information by their patient id and
// View a detailed test by their patient id and test id.
// cd into tests folder
//This will run all tests by using this command on terminal "mocha clinical-test.js"

var chai = require("chai"),
  chaiHttp = require("chai-http");

var expect = chai.expect;

chai.use(chaiHttp);

// Url deployed on heroku server
var url = "https://smarthealth2.herokuapp.com";

// This is our Patient id to test
// replaced this id if it is changed
var patientId = "6372daf5f57d8400161d4a30";

// This is our Test id to test
// When calling create clinical test, the new test id will be stored here.
var testId = "";

// Test data for create blood pressure clinical tests
// {
//     "category": "Blood Pressure",
//     "date": "2022-10-07",
//     "nurse_name": "Amanda",
//     "readings": {
//         "systolic": 130,
//         "diastolic": 90
//     }
// }

// Test data for create Respiratory rate clinical tests
// {
//     “category”: "Respiratory rate",
//    “date”: "2022-10-01",
//    “nurse_name”: "Amanda",
//    “readings”: {
//      “bpm”: 12,
//    }
// }

// Test data for create Blood Oxygen level clinical tests
// {
//     “category”: "Blood Oxygen Level",
//     “date”: "2022-10-01",
//     “nurse_name”: "Amanda",
//     “readings”: {
//       “percentage”: 95,
//     }
// }

// Test data for create Heart Beat reate clinical tests
// {
//     “category”: "Heart Beat Rate",
//     “date”: "2022-10-01",
//     “nurse_name”: "Amanda",
//     “readings”: {
//       “bpm”: 60,
//     }
//  }

//Check if API create a clinical test for a patient by their patient id returns 201
describe("when we issue a 'POST' to create a clinical test for a patient by their patient id", function () {
  it("should return HTTP 201", function (done) {
    chai
      .request(url)
      .post("/patients/" + patientId + "/tests")
      .send({
        category: "Blood Pressure",
        date: "2022-11-17",
        nurse_name: "Conor",
        readings: {
          systolic: 80,
          diastolic: 70,
        },
      })
      .end(function (req, res) {
        testId = res.body._id;
        expect(res.status).to.equal(201);
        done();
      });
  });
});

//Check if API get all clinical tests of a patient by their patient id returns status 200
describe("when we issue a 'GET' to get all clinical tests of a patient by their patient id'", function () {
  it("should return HTTP 200", function (done) {
    chai
      .request(url)
      .get("/patients/" + patientId + "/tests")
      .end(function (req, res) {
        console.log(res.body);
        expect(res.status).to.equal(200);
        done();
      });
  });
});

//Check if API get view a clinical test detail of a patient by their patient id and test id which must returns status 200
describe("when we issue a 'GET' to view a clinical test detail of a patient by their patient id and test id'", function () {
  it("should return HTTP 200", function (done) {
    chai
      .request(url)
      .get("/patients/" + patientId + "/tests/" + testId)
      .end(function (req, res) {
        console.log(res.body);
        expect(res.status).to.equal(200);
        done();
      });
  });
});
