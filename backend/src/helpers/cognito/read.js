const AWS = require("aws-sdk");
const moment = require("moment-timezone");
module.exports.listCognitoUsers = async () => {
  return new Promise(async (resolve, reject) => {
    const params = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
    };
    try {
      AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      const cognitoidentityserviceprovider =
        new AWS.CognitoIdentityServiceProvider();
      const result = await cognitoidentityserviceprovider
        .listUsers(params)
        .promise();
      let salida = [];
      if (result.Users.length > 0) {
        result.Users.map((usuario, indice) => {
          let usr = {};
          usuario.Attributes.map((actual, index) => {
            if (actual.Name === "sub") {
              usr.sub = actual.Value;
            } else if (actual.Name === "email") {
              usr.email = actual.Value;
            }
            if (index == usuario.Attributes.length - 1) {
              usr.Username = usuario.Username;
              usr.UserCreateDate = moment(usuario.UserCreateDate)
                .tz("America/Guatemala")
                .format("LLL");
              usr.UserLastModifiedDate = moment(usuario.UserLastModifiedDate)
                .tz("America/Guatemala")
                .format("LLL");
              salida.push(usr);
              if (indice == result.Users.length - 1) {
                resolve(salida);
              }
            }
          });
        });
      } else {
        resolve(salida);
      }
    } catch (error) {
      console.error("Error listing Cognito users:", error);
      reject(error);
    }
  });
};
