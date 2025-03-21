const query = require("../../helpers/database/mysql/operation/query");

const readColaborador = async (req, res) => {
  query
    .query(
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
        DATE_FORMAT(colaborador.fecha_registro,"%d/%m/%Y %r") AS fecha_registro, 
        DATE_FORMAT(colaborador.fecha_update,"%d/%m/%Y %r") AS fecha_update,
        CONVERT(usuario.cognito_sub, char) as cognito_sub, 
        estado_usuario.descripcion as estado_usuario, 
        tipo_usuario.descripcion as tipo_usuario,
        estado_civil.descripcion as estado_civil        
    FROM proyecto.colaborador
    inner join usuario on colaborador.usuario_id = usuario.id
    inner join estado_civil on colaborador.estado_civil_id = estado_civil.id
    inner join estado_usuario on usuario.estado_usuario_id = estado_usuario.id
    inner join tipo_usuario on usuario.tipo_usuario_id = tipo_usuario.id;`
    )
    .then((response_database) => {
      return res.status(200).json({
        response_database,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ log: error });
    });
};

module.exports = {
  readColaborador,
};
