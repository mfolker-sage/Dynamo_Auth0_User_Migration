"use strict";
const AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-west-1"
});
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  console.log(JSON.stringify(event));

  if (event.path.startsWith("/get-user/") && event.httpMethod !== "GET") {
    return statusCodeResult(400);
  }

  const params = {
    TableName: "MigrantUsers",
    ExpressionAttributeNames: {
      "#emailAddress": "emailAddress"
    },
    ExpressionAttributeValues: {
      ":emailAddress": event.path.replace("/get-user/", "")
    },
    FilterExpression: "#emailAddress = :emailAddress"
  };

  try {
    const result = await docClient.scan(params).promise();

    if (result.Items.length !== 1) {
      console.error("Incorrect number of records");
      return notExactlyOneRecord();
    }

    return statusCodeResult(200, JSON.stringify(result.Items[0]));
  } catch (err) {
    console.error(err);
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
