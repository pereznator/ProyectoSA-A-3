const query_format = require("../../helpers/database/mysql/operation/queryFormat");
const update_on_cognito = require("../../helpers/cognito/update");
const updateColaborador = async (req, res) => {
  const { id } = req.params;
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
    estado_usuario_id,
  } = req.body;
  query_format
    .queryFormat(
      `SELECT 
            colaborador.id, 
            convert(nombre_completo, char) as nombre_completo,
            telefono, 
            dpi, 
            convert(cv, char) as cv,
            convert(fotografia, char) as fotografia, 
            convert(domicilio, char) as domicilio, 
            edad, 
            genero, 
            convert(seguro_social, char) as seguro_social, 
            convert(cuenta_bancaria, char) as cuenta_bancaria, 
            usuario_id, 
            estado_civil_id, 
            colaborador.fecha_registro,
            colaborador.fecha_update,
            usuario.estado_usuario_id      
        FROM proyecto.colaborador
                inner join usuario on colaborador.usuario_id = usuario.id
        where colaborador.id = ?`,
      [id]
    )
    .then((response_search) => {
      if (response_search.result.length > 0) {
        let query_array = [];
        query_array.push({
          query: `UPDATE proyecto.colaborador
        SET nombre_completo=?, telefono=?, dpi=?, cv=?, fotografia=?, domicilio=?, edad=?, genero=?, seguro_social=?, cuenta_bancaria=?, estado_civil_id=?, fecha_update=current_timestamp()
        WHERE id=?`,
          inserts: [
            nombre_completo != null
              ? nombre_completo
              : response_search.result[0].nombre_completo,
            telefono != null ? telefono : response_search.result[0].telefono,
            dpi != null ? dpi : response_search.result[0].dpi,
            cv != null ? cv : response_search.result[0].cv,
            fotografia != null
              ? fotografia
              : response_search.result[0].fotografia,
            domicilio != null ? domicilio : response_search.result[0].domicilio,
            edad != null ? edad : response_search.result[0].edad,
            genero != null ? genero : response_search.result[0].genero,
            seguro_social != null
              ? seguro_social
              : response_search.result[0].seguro_social,
            cuenta_bancaria != null
              ? cuenta_bancaria
              : response_search.result[0].cuenta_bancaria,
            estado_civil_id != null
              ? estado_civil_id
              : response_search.result[0].estado_civil_id,
            id,
          ],
        });
        if (estado_usuario_id != null) {
          query_array.push({
            query: `UPDATE proyecto.usuario
          SET fecha_update=current_timestamp(), estado_usuario_id=?
          WHERE id=?;`,
            inserts: [
              estado_usuario_id != null
                ? estado_usuario_id
                : response_search.result[0].estado_usuario_id,
              response_search.result[0].usuario_id,
            ],
          });
        }
        query_format
          .queryFormatWithTransactionArray(query_array)
          .then(async (response_database) => {
            if (email != null && codigo_empleado) {
              update_on_cognito
                .update({
                  username: codigo_empleado,
                  email: email,
                })
                .then((response_cognito) => {
                  return res
                    .status(200)
                    .json({ response_database, response_cognito });
                })
                .catch((error) => {
                  console.log(error);
                  return res.status(500).json({ log: error });
                });
            } else {
              return res.status(200).json({ response_database });
            }
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json({ log: error });
          });
      } else {
        return res.status(200).json({ log: "COLABORADOR NO ENCONTRADO" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  updateColaborador,
};
