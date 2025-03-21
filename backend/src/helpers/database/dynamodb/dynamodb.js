const AWS = require("aws-sdk");
const moment = require("moment-timezone");
const { v4 } = require("uuid");

const putObject = async (TableName, Item) => {
  return new Promise(async (resolve, reject) => {
    try {
      AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      if (!Item.id) {
        Item.id = v4();
      }
      Item.fecha_registro = moment(new Date()).tz("America/Guatemala").format();
      const dynamodb = new AWS.DynamoDB.DocumentClient();
      await dynamodb
        .put({
          TableName,
          Item,
        })
        .promise();
      resolve(Item);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
const deleteObject = async (TableName, Key) => {
  return new Promise(async (resolve, reject) => {
    try {
      AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      const dynamodb = new AWS.DynamoDB.DocumentClient();
      await dynamodb
        .delete({
          TableName,
          Key,
        })
        .promise();
      resolve("Ok");
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
const readObjects = async (TableName) => {
  return new Promise(async (resolve, reject) => {
    try {
      AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      const dynamodb = new AWS.DynamoDB.DocumentClient();
      const result = await dynamodb.scan({ TableName }).promise();
      resolve(result.Items);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
const updateObject = async (
  TableName,
  Key,
  UpdateExpression,
  ExpressionAttributeValues
) => {
  return new Promise(async (resolve, reject) => {
    try {
      AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      const dynamodb = new AWS.DynamoDB.DocumentClient();
      let params = {
        TableName,
        Key,
        UpdateExpression,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
      };
      console.log(TableName, Key, UpdateExpression, ExpressionAttributeValues);
      await dynamodb.update(params).promise();
      resolve("Ok");
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const viewObject = async (TableName, Key) => {
  return new Promise(async (resolve, reject) => {
    console.log(TableName, Key);
    try {
      AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      const dynamodb = new AWS.DynamoDB.DocumentClient();
      const result = await dynamodb
        .get({
          TableName,
          Key,
        })
        .promise();
      resolve(result.Item);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const queryObjects = async (
  TableName,
  KeyConditionExpression,
  ExpressionAttributeValues
) => {
  return new Promise(async (resolve, reject) => {
    try {
      AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      console.log(TableName, KeyConditionExpression, ExpressionAttributeValues);
      const dynamodb = new AWS.DynamoDB.DocumentClient();
      const result = await dynamodb
        .query({
          TableName,
          KeyConditionExpression,
          ExpressionAttributeValues,
        })
        .promise();
      resolve(result.Items);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const scanObjects = async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      console.log(params);
      const dynamodb = new AWS.DynamoDB.DocumentClient();
      const result = await dynamodb.scan(params).promise();
      resolve(result.Items);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
module.exports = {
  putObject,
  deleteObject,
  readObjects,
  updateObject,
  viewObject,
  queryObjects,
  scanObjects,
};
