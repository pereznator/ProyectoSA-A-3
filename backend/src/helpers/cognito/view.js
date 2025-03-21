const AWS = require("aws-sdk");
const moment = require("moment-timezone");
module.exports.getUserAttributesBySub = async (sub) => {
  return new Promise(async (resolve, reject) => {
    try {
      AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Filter: `sub = "${sub}"`,
      };
      const cognitoidentityserviceprovider =
        new AWS.CognitoIdentityServiceProvider();
      const result = await cognitoidentityserviceprovider
        .listUsers(params)
        .promise();
      if (result.Users && result.Users.length === 1) {
        const userAttributes = result.Users[0];
        let salida = {};
        userAttributes.Attributes.map((actual, index) => {
          if (actual.Name === "sub") {
            salida.sub = actual.Value;
          } else if (actual.Name === "email") {
            salida.email = actual.Value;
          }
          if (index == userAttributes.Attributes.length - 1) {
            salida.Username = userAttributes.Username;
            salida.UserCreateDate = moment(userAttributes.UserCreateDate)
              .tz("America/Guatemala")
              .format("LLL");
            salida.UserLastModifiedDate = moment(
              userAttributes.UserLastModifiedDate
            )
              .tz("America/Guatemala")
              .format("LLL");
            resolve(salida);
          }
        });
      } else {
        reject("User not found or multiple users with the same sub.");
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.getUserAttributesByUsername = async (username) => {
  return new Promise(async (resolve, reject) => {
    try {
      AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
      };
      const cognitoidentityserviceprovider =
        new AWS.CognitoIdentityServiceProvider();
      const result = await cognitoidentityserviceprovider
        .adminGetUser(params)
        .promise();
      let salida = {};
      result.UserAttributes.map((actual, index) => {
        if (actual.Name === "sub") {
          salida.sub = actual.Value;
        } else if (actual.Name === "email") {
          salida.email = actual.Value;
        }
        if (index == result.UserAttributes.length - 1) {
          salida.Username = result.Username;
          salida.UserCreateDate = moment(result.UserCreateDate)
            .tz("America/Guatemala")
            .format("LLL");
          salida.UserLastModifiedDate = moment(result.UserLastModifiedDate)
            .tz("America/Guatemala")
            .format("LLL");
          resolve(salida);
        }
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.getUserAttributesByEmail= async (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        email,
      };
      const cognitoidentityserviceprovider =
        new AWS.CognitoIdentityServiceProvider();
      const result = await cognitoidentityserviceprovider
        .adminGetUser(params)
        .promise();
      let salida = {};
      result.UserAttributes.map((actual, index) => {
        if (actual.Name === "sub") {
          salida.sub = actual.Value;
        } else if (actual.Name === "email") {
          salida.email = actual.Value;
        }
        if (index == result.UserAttributes.length - 1) {
          salida.Username = result.Username;
          salida.UserCreateDate = moment(result.UserCreateDate)
            .tz("America/Guatemala")
            .format("LLL");
          salida.UserLastModifiedDate = moment(result.UserLastModifiedDate)
            .tz("America/Guatemala")
            .format("LLL");
          resolve(salida);
        }
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
