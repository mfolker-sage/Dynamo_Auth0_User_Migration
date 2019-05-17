"use strict";
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const bcrypt = require("bcrypt");

exports.handler = async event => {
  console.log(JSON.stringify(event));

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
  let responseBody = null;

  try {
    try {
      responseBody = await docClient.scan(params).promise();
      statusCode = 200;
    } catch (err) {
      console.log(err);
    }

    return {
      statusCode: statusCode,
      body: responseBody
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: e
    };
  }
};
