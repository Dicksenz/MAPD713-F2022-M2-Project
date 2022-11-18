// This is testing if heroku server smarthealth2 responds status 200
// On terminal type cd tests then
// Use this command "mocha critical-condition-test.js" on the terminal to run this test.

var chai = require("chai"),
  chaiHttp = require("chai-http");

var expect = chai.expect;

chai.use(chaiHttp);

// Url deployed on heroku
var url = "https://smarthealth2.herokuapp.com";

//Check if API get all patients having critical conditions returns status 200
describe("when we issue a 'GET' to get all patients having critical conditions'", function () {
  it("should return HTTP 200", function (done) {
    chai
      .request(url)
      .get("/patients/conditions")
      .end(function (req, res) {
        console.log(res.body);
        expect(res.status).to.equal(200);
        done();
      });
  });
});
