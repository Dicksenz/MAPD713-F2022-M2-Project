//This is API testing file to test create patient, Get all patients and
//Get a patient general information by their patient id.
// cd into tests folder
//This will run all tests by using this command on terminal "mocha patient-test.js"

var chai = require("chai"),
  chaiHttp = require("chai-http");

var expect = chai.expect;

chai.use(chaiHttp);

// Url deployed on heroku
var url = "https://smarthealth2.herokuapp.com";

// This is our Patient id to test
// When calling create patient test, the new id will be stored here.
var patientId = "";

//Check if API create a patient returns 201
describe("when we issue a 'POST' to create a patient'", function () {
  it("should return HTTP 201", function (done) {
    chai
      .request(url)
      .post("/patients")
      .send({
        first_name: "Bram",
        last_name: "Doe",
        email: "johon@test.com",
        mobile_number: "6475253139",
        address: "Richmond hill",
        sex: "M",
        date_of_birth: "1992-07-31",
      })
      .end(function (req, res) {
        patientId = res.body._id;
        expect(res.status).to.equal(201);
        done();
      });
  });
});
//Check if API get all patients returns status 200
describe("when we issue a 'GET' to get all patients'", function () {
  it("should return HTTP 200", function (done) {
    chai
      .request(url)
      .get("/patients")
      .end(function (req, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });
});

//Check if API get patient general information by their patient id return status 200
describe("when we issue a 'GET' to get a patient general information by their patient id'", function () {
  it("should return HTTP 200", function (done) {
    chai
      .request(url)
      .get("/patients/" + patientId)
      .end(function (req, res) {
        //log patient general information
        console.log(res.body);
        expect(res.status).to.equal(200);
        done();
      });
  });
});
