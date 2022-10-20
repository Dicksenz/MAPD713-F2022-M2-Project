var DEFAULT_PORT = 5000;
var DEFAULT_HOST = "127.0.0.1";
var SERVER_NAME = "smarthealth";

var http = require("http");
var mongoose = require("mongoose");

var port = process.env.PORT;
var ipaddress = process.env.IP; // Must be changed to integrate heroku later.
