const AWS = require("aws-sdk");
const read_users = require("./read");
const create = async (usr) => {
  return new Promise(async (resolve, reject) => {
    try {
      AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      const params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Password: usr.password,
        Username: usr.username,
        UserAttributes: [{ Name: "email", Value: usr.email }],
      };
      const confirmParams = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: usr.username,
      };
      const Cognito = new AWS.CognitoIdentityServiceProvider();
      const response = await Cognito.signUp(params).promise();
      await Cognito.adminConfirmSignUp(confirmParams).promise();
      resolve({
        ret: 1,
        log: "Ok",
        response: response,
      });
    } catch (error) {
      console.log(error);
      reject({ ret: 0, err: error });
    }
  });
};

const verifyUsr = (usr) => {
  return new Promise(async (resolve, reject) => {
    await read_users
      .listCognitoUsers()
      .then((response) => {
        let found_usrname = response.find(
          (element) => element.Username == usr.username
        );
        let found_email = response.find(
          (element) => element.email == usr.email
        );
        if (found_email && found_usrname) {
          resolve({
            found: true,
            sub: found_email.sub,
            email: found_email.email,
            Username: found_email.Username,
            msg: `El email: "${found_email.email}" y el nombre de usuario: "${found_usrname.Username} se encunetran ya registrados`,
          });
        } else if (found_email) {
          resolve({
            found: true,
            sub: found_email.sub,
            email: found_email.email,
            Username: found_email.Username,
            msg: `El email: "${found_email.email}" se encunetra ya registrado`,
          });
        } else if (found_usrname) {
          resolve({
            found: true,
            sub: found_usrname.sub,
            email: found_usrname.email,
            Username: found_usrname.Username,
            msg: `El nombre de usuario: "${found_usrname.Username}" se encuentra ya registrado`,
          });
        } else {
          resolve({ found: false, sub: null });
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

module.exports = {
  create,
  verifyUsr,
};
