"use strict";
const AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-west-1"
});
const docClient = new AWS.DynamoDB.DocumentClient();
const bcrypt = require("bcrypt");

exports.handler = async event => {
  console.log(JSON.stringify(event));

  if (event.path !== "/login" || event.path !== "/get-user") {
    return statusCodeResult(404);
  }

  if (
    (event.path === "/login" && event.httpMethod !== "POST") ||
    (event.path.startsWith("/get-user") && event.httpMethod !== "GET")
  ) {
    return statusCodeResult(400);
  }

  try {
    const suppliedUserDetails = getSuppliedUserDetails(event);

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

    if (result.Items.length !== 1) {
      return moreThanOneRecord();
    }

    if (event.path === "/login") {
      if (
        bcrypt.compareSync(
          suppliedUserDetails.password,
          result.Items[0].credential
        )
      ) {
        return statusCodeResult(200);
      }

      return statusCodeResult(403);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        emailAddress: result.Items[0].emailAddress,
        name: result.Items[0].name
      })
    };
  } catch (err) {
    console.log(err);
    return statusCodeResult(500);
  }
};

function moreThanOneRecord() {
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
    return JSON.parse(event.body);
  }

  return {
    emailAddress: event.path.replace("/get-user/")
  };
}
