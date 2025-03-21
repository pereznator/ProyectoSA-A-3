const AWS = require("aws-sdk");
const handleLogout = async (req, res) => {
  try {
    AWS.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
    const refreshToken = req.headers["authorization"];
    const params_rt = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Token: refreshToken.substring(7),
    };
    const Cognito = new AWS.CognitoIdentityServiceProvider();
    const response = await Cognito.revokeToken(params_rt).promise();
    return res.status(200).json({ response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};
module.exports = {
  handleLogout,
};
