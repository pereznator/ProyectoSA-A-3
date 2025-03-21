const AWS = require("aws-sdk");
const delete_cognito = async (usr) => {
  return new Promise(async (resolve, reject) => {
    try {
      AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: usr,
      };
      const Cognito = new AWS.CognitoIdentityServiceProvider();
      await Cognito.adminDeleteUser(params).promise();
      resolve({ ret: 1, log: "Ok" });
    } catch (error) {
      reject({ ret: 0, err: error });
    }
  });
};

module.exports = {
  delete_cognito,
};
