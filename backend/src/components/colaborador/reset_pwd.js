const update_on_cognito = require("../../helpers/cognito/update");
const view_on_cognito = require("../../helpers/cognito/view");
const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const email = require("../../helpers/email/email");
const recovery_template = require("../../helpers/email/templates/pwd_recovery");
const resetPassword = async (req, res) => {
  const { id } = req.params;
  const { new_password } = req.body;
  view_on_cognito
    .getUserAttributesBySub(id)
    .then((response_cognito_search) => {
      update_on_cognito
        .update_password({
          Username: response_cognito_search.Username,
          Password: new_password,
        })
        .then((response_cognito) => {
          return res.status(200).json({
            response_cognito,
          });
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({ log: error });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

const sendMailPasswordRecovery = (req, res) => {
  let { username } = req.body;
  view_on_cognito
    .getUserAttributesByUsername(username)
    .then((response_cognito) => {
      try {
        email.sendMail(
          response_cognito.email,
          "RECUPERAR CONTRASEÑA CiberVideoGame",
          recovery_template.getEmailHTML(response_cognito.sub)
        );
        return res.status(200).json({ log: "Ok" });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ log: error });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};
module.exports = {
  resetPassword,
  sendMailPasswordRecovery,
};
