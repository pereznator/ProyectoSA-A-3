function getMailContent(enableAccountUrl, username) {
  return `
  <!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenido a Swiptify</title>
</head>
<body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f6f6f6;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #4F46E5; padding: 30px; color: #ffffff; text-align: center;">
              <h1 style="margin: 0;">¡Bienvenido ${username} a Swiptify!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 16px; color: #333333;">
                Hola <strong>${username}</strong>,
              </p>
              <p style="font-size: 16px; color: #333333;">
                Estamos muy emocionados de tenerte con nosotros. Swiptify está diseñado para ofrecerte lo mejor en tecnología, automatización y eficiencia.
              </p>
              <p style="font-size: 16px; color: #333333;">
                Para comenzar, simplemente haz clic en el botón de abajo para activar tu cuenta y empezar a disfrutar de todos nuestros productos.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${enableAccountUrl}" style="background-color: #4F46E5; color: white; padding: 14px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold;">
                  Activar mi cuenta
                </a>
              </div>
              <p style="font-size: 14px; color: #666666;">
                Si no creaste esta cuenta, puedes ignorar este correo.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #888888;">
              © 2025 Swiptify Inc. Todos los derechos reservados.<br>
              <a href="https://swiptify.com" style="color: #888888; text-decoration: none;">swiptify.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

module.exports = { getMailContent };