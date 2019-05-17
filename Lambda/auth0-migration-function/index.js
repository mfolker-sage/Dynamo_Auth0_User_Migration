"use strict";
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const bcrypt = require("bcrypt");

exports.handler = async event => {
  console.log(JSON.stringify(event));

  try {
    var params = {
      TableName: "MigrantUsers",
      ProjectionExpression: "emailAddress, basicAuth.password",
      ExpressionAttributeNames: {
        "#emailAddress": "emailAddress"
      },
      ExpressionAttributeValues: {
        ":emailAddress": "employer.publisher@sage.com"
      },
      FilterExpression: "#emailAddress = :emailAddress"
    };

    let statusCode = 500;
    let message = "Something is missing - pipeline test - auto test";

    console.log("about to scan");

    await docClient.scan(params, onScan);

    // console.log("scan complete");

    let result = null;

    function onScan(err, data) {
      console.log("on scan");

      if (err) {
        console.error(
          "Unable to scan the table. Error JSON:",
          JSON.stringify(err)
        );
        return;
      } else {
        console.log("Scan succeeded.");

        // if (!data.items || data.items[0].length < 1) {
        //   statusCode = 404;
        //   message = "Too many or too few";
        //   return;
        // }

        console.log(data);

        result = data;

        return {
          statusCode: statusCode,
          body: JSON.stringify(result)
        };

        // return {
        //   statusCode: 200,
        //   body: JSON.stringify(data)
        // };
      }
    }

    // switch (event.path) {
    //   case "/login":
    //     return {
    //       statusCode: statusCode,
    //       body: message
    //     };
    //     break;

    //   case "/get-user":
    //     return {
    //       statusCode: 200,
    //       body: "Get user"
    //     };
    //     break;

    //   default:
    //     console.error(
    //       "Request to unknown end point received. Event details:",
    //       JSON.stringify(event)
    //     );
    //     return {
    //       statusCode: 404,
    //       body: JSON.stringify(event)
    //     };
    // }

    // return response;
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: e
    };
  }
};
