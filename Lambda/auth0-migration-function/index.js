"use strict";
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const bcrypt = require("bcrypt");

exports.handler = async (event, context) => {
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(context));

  try {
    var params = {
      TableName: "MigrantUsers",
      ProjectionExpression: "emailAddress, basicAuth.password",
      FilterExpression: "emailAddress = " + "employer.publisher@sage.com"
    };

    let statusCode = 500;
    let message = "Something is missing - pipeline test - auto test";

    console.log("about to scan");

    await docClient.scan(params, onScan);

    // console.log("scan complete");

    function onScan(err, data) {
      if (err) {
        console.error(
          "Unable to scan the table. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        console.log("Scan succeeded.");

        if (!data.Items || data.Items[0].length < 1) {
          statusCode = 404;
          message = "Too many or too few";
          return;
        }

        statusCode = 200;
        message = "user matched";
      }
    }

    switch (event.path) {
      case "/login":
        return {
          statusCode: statusCode,
          body: message
        };
        break;

      case "/get-user":
        return {
          statusCode: 200,
          body: "Get user"
        };
        break;

      default:
        console.error(
          "Request to unknown end point received. Event details:",
          JSON.stringify(event)
        );
        return {
          statusCode: 404,
          body: JSON.stringify(event)
        };
    }

    return response;
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: e
    };
  }
};
