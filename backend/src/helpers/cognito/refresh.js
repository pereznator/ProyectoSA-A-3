const AWS = require("aws-sdk");
const handleRefresh = async (req, res) => {
  try {
    AWS.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
    const authorizationHeader = req.headers["authorization"];
    const token = authorizationHeader.substring(7);
    const params = {
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: token,
      },
    };
    const Cognito = new AWS.CognitoIdentityServiceProvider();
    const response = await Cognito.initiateAuth(params).promise();
    return res.status(200).json(response.AuthenticationResult);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};
module.exports = {
  handleRefresh,
};
