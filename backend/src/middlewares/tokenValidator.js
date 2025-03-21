const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const view_on_cognito = require("../helpers/cognito/view");
const cognitoIssuer = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`;
const jsonFormat = require("../helpers/utils/jsonFormat");
const client = jwksClient({
  jwksUri: `${cognitoIssuer}/.well-known/jwks.json`,
});

async function validateToken(token, kid) {
  const key = await client.getSigningKey(kid);
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      key.getPublicKey(),
      { issuer: cognitoIssuer },
      (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      }
    );
  });
}

exports.authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader.substring(7);
    const decodedToken = jwt.decode(token, { complete: true, json: true });
    if (decodedToken.header) {
      const userData = await validateToken(token, decodedToken.header.kid);
      view_on_cognito
        .getUserAttributesByUsername(userData.username)
        .then((response) => {
          console.log("response", response);
          req.userData = response;
          next();
        })
        .catch((error) => {
          return res.status(500).json({ log: error });
        });
    } else {
      return res.status(500).json({ log: "ERROR: Token inválido" });
    }
  } catch(err) {
    return res.status(500).json({ log: err.toString() });
  }
};
