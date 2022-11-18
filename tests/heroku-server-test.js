// This is testing if heroku server smarthealth2 responds status 200
// On terminal type cd tests then
// Use this command "mocha heroku-server-test.js" on the terminal to run this test.

var chai = require("chai"),
  chaiHttp = require("chai-http");

var expect = chai.expect;

chai.use(chaiHttp);

// Url deployed on heroku
var url = "https://smarthealth2.herokuapp.com";

//Check if heroku server is running.
describe("when we issue a 'GET' to heroku server smarthealth2'", function () {
  it("should return HTTP 200", function (done) {
    chai
      .request(url)
      .get("/")
      .end(function (req, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });
});
