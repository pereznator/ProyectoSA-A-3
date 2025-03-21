const AWS = require("aws-sdk");
const update = async (usr) => {
  return new Promise(async (resolve, reject) => {
    try {
      AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      let attributes = [];
      if (usr.email != undefined && usr.email != null) {
        attributes.push({ Name: "email", Value: usr.email });
      }
      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: usr.username,
        UserAttributes: attributes,
      };
      const Cognito = new AWS.CognitoIdentityServiceProvider();
      await Cognito.adminUpdateUserAttributes(params).promise();
      resolve({ ret: 1, log: "Ok" });
    } catch (error) {
      console.log("HOLA", error);
      reject({ ret: 0, err: error });
    }
  });
};
const update_password = async (usr) => {
  return new Promise(async (resolve, reject) => {
    try {
      AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: usr.Username,
        Password: usr.Password,
        Permanent: true,
      };
      const Cognito = new AWS.CognitoIdentityServiceProvider();
      await Cognito.adminSetUserPassword(params).promise();
      resolve({ ret: 1, log: "Ok" });
    } catch (error) {
      console.log(error);
      reject({ ret: 0, err: error });
    }
  });
};
module.exports = {
  update,
  update_password,
};
