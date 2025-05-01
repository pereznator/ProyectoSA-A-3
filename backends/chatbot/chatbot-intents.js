// chatbot-intents.js
const natural = require('natural');
const classifier = new natural.BayesClassifier();

// === ENTRENAMIENTO PRECISO DE INTENCIONES PERMITIDAS ===

// obtener_reportes_usuarios
classifier.addDocument('mostrar reportes de usuarios', 'obtener_reportes_usuarios');
classifier.addDocument('ver reportes de usuarios', 'obtener_reportes_usuarios');
classifier.addDocument('listar reportes de usuarios', 'obtener_reportes_usuarios');
classifier.addDocument('cuáles son los reportes de usuarios', 'obtener_reportes_usuarios');
classifier.addDocument('quiero ver los reportes de usuarios', 'obtener_reportes_usuarios');
classifier.addDocument('enséñame los reportes de usuarios', 'obtener_reportes_usuarios');
classifier.addDocument('muéstrame los reportes de usuarios', 'obtener_reportes_usuarios');
classifier.addDocument('dame los reportes de usuarios', 'obtener_reportes_usuarios');
classifier.addDocument('revisar los reportes de usuarios', 'obtener_reportes_usuarios');
classifier.addDocument('consultar reportes de usuarios', 'obtener_reportes_usuarios');

// obtener_usuarios_no_admin
classifier.addDocument('ver usuarios que no son admin', 'obtener_usuarios_no_admin');
classifier.addDocument('mostrar usuarios normales', 'obtener_usuarios_no_admin');
classifier.addDocument('quienes no son administradores', 'obtener_usuarios_no_admin');
classifier.addDocument('lista de usuarios no admin', 'obtener_usuarios_no_admin');
classifier.addDocument('usuarios sin permisos de administrador', 'obtener_usuarios_no_admin');
classifier.addDocument('dame los usuarios que no son admins', 'obtener_usuarios_no_admin');
classifier.addDocument('muéstrame usuarios normales', 'obtener_usuarios_no_admin');
classifier.addDocument('quiénes son los usuarios regulares', 'obtener_usuarios_no_admin');
classifier.addDocument('usuarios sin privilegios', 'obtener_usuarios_no_admin');
classifier.addDocument('usuarios básicos del sistema', 'obtener_usuarios_no_admin');

// ver_todas_promociones
classifier.addDocument('ver todas las promociones', 'ver_todas_promociones');
classifier.addDocument('mostrar promociones disponibles', 'ver_todas_promociones');
classifier.addDocument('promociones activas', 'ver_todas_promociones');
classifier.addDocument('cuáles son las promociones', 'ver_todas_promociones');
classifier.addDocument('listado de promociones', 'ver_todas_promociones');
classifier.addDocument('enséñame las promociones', 'ver_todas_promociones');
classifier.addDocument('quiero ver promociones', 'ver_todas_promociones');
classifier.addDocument('hay promociones disponibles', 'ver_todas_promociones');
classifier.addDocument('dame las promociones vigentes', 'ver_todas_promociones');
classifier.addDocument('qué promociones tienen', 'ver_todas_promociones');

// ver_productos
classifier.addDocument('ver productos', 'ver_productos');
classifier.addDocument('mostrar productos', 'ver_productos');
classifier.addDocument('cuáles son los productos disponibles', 'ver_productos');
classifier.addDocument('listar productos', 'ver_productos');
classifier.addDocument('catálogo de productos', 'ver_productos');
classifier.addDocument('enséñame los productos', 'ver_productos');
classifier.addDocument('quiero ver los productos', 'ver_productos');
classifier.addDocument('muéstrame el listado de productos', 'ver_productos');
classifier.addDocument('dónde están los productos', 'ver_productos');
classifier.addDocument('hay productos disponibles', 'ver_productos');

// ver_todas_ordenes
classifier.addDocument('ver todas las ordenes', 'ver_todas_ordenes');
classifier.addDocument('mostrar todas las órdenes', 'ver_todas_ordenes');
classifier.addDocument('cuáles son las órdenes registradas', 'ver_todas_ordenes');
classifier.addDocument('listar todas las órdenes', 'ver_todas_ordenes');
classifier.addDocument('quiero ver todas las órdenes', 'ver_todas_ordenes');
classifier.addDocument('dame el historial completo de órdenes', 'ver_todas_ordenes');
classifier.addDocument('enséñame todas las órdenes registradas', 'ver_todas_ordenes');
classifier.addDocument('quiero revisar todas las órdenes', 'ver_todas_ordenes');
classifier.addDocument('listado de todas las órdenes', 'ver_todas_ordenes');
classifier.addDocument('historial de compras completas', 'ver_todas_ordenes');

classifier.train();

module.exports = classifier;
