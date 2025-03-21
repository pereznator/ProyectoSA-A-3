const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const register_on_cognito = require("../../helpers/cognito/create");
const createColaborador = async (req, res) => {
  const {
    nombre_completo,
    telefono,
    dpi,
    cv,
    fotografia,
    domicilio,
    edad,
    genero,
    seguro_social,
    cuenta_bancaria,
    estado_civil_id,
    email,
    codigo_empleado,
    password,
  } = req.body;

  await register_on_cognito
    .verifyUsr({
      username: codigo_empleado,
      email: email,
    })
    .then(async (response_verify_usr) => {
      if (!response_verify_usr.found) {
        await register_on_cognito
          .create({
            username: codigo_empleado,
            email: email,
            password: password,
          })
          .then(async (response_cognito) => {
            query_format
              .queryFormatWithTransactionArray([
                {
                  query: `INSERT INTO proyecto.usuario
                (cognito_sub, estado_usuario_id, tipo_usuario_id)
                VALUES( ?, 1, 2);`,
                  inserts: [response_cognito.response.UserSub],
                },
                {
                  query: `INSERT INTO proyecto.colaborador
                (nombre_completo, telefono, dpi, cv, fotografia, domicilio, edad, genero, seguro_social, cuenta_bancaria, usuario_id, estado_civil_id)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, LAST_INSERT_ID(), ?);`,
                  inserts: [
                    nombre_completo,
                    telefono,
                    dpi,
                    cv,
                    fotografia,
                    domicilio,
                    edad,
                    genero,
                    seguro_social,
                    cuenta_bancaria,
                    estado_civil_id,
                  ],
                },
              ])
              .then((response_database) => {
                return res.status(200).json({
                  cognito: response_cognito,
                  database: response_database,
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
      } else {
        return res
          .status(400)
          .json({ usuario_repetido: true, msg: response_verify_usr.msg });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  createColaborador,
};
