"use strict";
const AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-west-1"
});
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  console.log(JSON.stringify(event));

  if (
    (event.path === "/login" && event.httpMethod !== "POST") ||
    (event.path.startsWith("/get-user") && event.httpMethod !== "GET")
  ) {
    return statusCodeResult(400);
  }

  console.log("HttpMethod suits path", event.httpMethod);

  try {
    const suppliedUserDetails = getSuppliedUserDetails(event);

    console.log("User details determined from request", suppliedUserDetails);

    const params = {
      TableName: "MigrantUsers",
      ExpressionAttributeNames: {
        "#emailAddress": "emailAddress"
      },
      ExpressionAttributeValues: {
        ":emailAddress": suppliedUserDetails.emailAddress
      },
      FilterExpression: "#emailAddress = :emailAddress"
    };

    const result = await docClient.scan(params).promise();

    console.log("Results returned from database scan", result);

    if (result.Items.length !== 1) {
      console.log("Incorrect number of records");
      return notExactlyOneRecord();
    }

    if (event.path === "/login") {
      console.log("Checking password hash.");

      if (suppliedUserDetails.password === result.Items[0].credential) {
        console.log("Password hash matches");
        return statusCodeResult(200);
      }

      console.log("Password hash did not match");
      return statusCodeResult(403);
    }

    console.log("Returning user details");

    return statusCodeResult(
      200,
      JSON.stringify({
        emailAddress: result.Items[0].emailAddress,
        name: result.Items[0].name
      })
    );
  } catch (err) {
    console.log(err);
    return statusCodeResult(500);
  }
};

function notExactlyOneRecord() {
  return statusCodeResult(
    500,
    "Could not find exactly one record. Request terminated."
  );
}

function statusCodeResult(statusCode, body) {
  return {
    statusCode: statusCode,
    body: body
  };
}

function getSuppliedUserDetails(event) {
  if (event.httpMethod === "POST") {
    console.log("returning the event body", event.body);
    return event.body;
  }

  return {
    emailAddress: event.path.replace("/get-user/")
  };
}
