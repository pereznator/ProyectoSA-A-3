// chatbot-server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import axios from 'axios';
import OpenAI from 'openai';
import classifier from './chatbot-intents.js';

const app = express();
const PORT = 3000;
const API_BASE = 'http://34.27.72.138/api';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

const formatList = (arr) =>
  arr
    .map(
      (obj, index) =>
        `\n${index + 1}. ${Object.entries(obj)
          .map(([key, value]) => `  - ${key}: ${value}`)
          .join('\n')}`
    )
    .join('\n');

app.post('/chat', async (req, res) => {
  const normalize = (text) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[.,!?]/g, '');
  const mensaje = normalize(req.body.mensaje);
  const { user_id } = req.body;

  let userRole = null;

  if (user_id) {
    try {
      const userRes = await axios.get(`${API_BASE}/user/obtener-usuario-por-id/${user_id}`);
      userRole = userRes.data?.usuario?.role || null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error.message);
    }
  }

  // Si el usuario es normal, dejar que solo agregue productos al carrito
  if (userRole === 'user') {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Extrae el product_id y quantity de la siguiente petición de usuario. Solo responde en JSON con las claves: product_id y quantity. No des ninguna otra explicación.',
          },
          { role: 'user', content: req.body.mensaje },
        ],
        temperature: 0.2,
      });

      const content = completion.choices[0].message.content;
      const jsonMatch = content.match(/\{[^\}]*\}/);

      if (!jsonMatch) {
        return res.json({ respuesta: 'Puedes pedirme que agregue un producto al carrito indicando su nombre o ID y la cantidad. Ejemplo: "Agrega 2 unidades del producto 5".' });
      }

      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.product_id || !parsed.quantity) {
        return res.json({ respuesta: 'Faltan datos para agregar el producto al carrito. Intenta especificar el producto y la cantidad.' });
      }

      const result = await axios.post(`${API_BASE}/cart/agregarProductoCarrito`, {
        user_id,
        product_id: parsed.product_id,
        quantity: parsed.quantity
      });

      return res.json({ respuesta: `✅ Producto agregado correctamente: ${parsed.quantity} unidad(es) del producto ${parsed.product_id}.` });
    } catch (err) {
      console.error('Error al agregar producto:', err.message);
      return res.json({ respuesta: 'Ocurrió un error al intentar agregar el producto al carrito.' });
    }
  }

  const predictions = classifier.getClassifications(mensaje);
  console.log('Predicciones:', predictions);
  const top = predictions[0];
  const second = predictions[1];

  const isAmbiguous = top && second && second.value / top.value > 0.9;

  if (isAmbiguous) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'Eres un asistente útil, empático y proactivo. Si el sistema no logra interpretar la intención del usuario, tu objetivo es ayudar al cliente a encontrar lo que necesita dentro de una tienda en línea. Da respuestas claras, guíalo con opciones como "¿Quieres ver productos?", "¿Estás buscando promociones?" o "¿Quieres revisar tus órdenes?". Nunca respondas que no sabes; intenta siempre redirigirlo.',
          },
          { role: 'user', content: req.body.mensaje },
        ],
        temperature: 0.7,
      });

      return res.json({
        respuesta: completion.choices[0].message.content.trim(),
      });
    } catch (err) {
      console.error('Error al llamar a OpenAI:', err.message);
      return res.json({
        respuesta:
          'No pude interpretar tu mensaje ni obtener ayuda externa. Intenta reformularlo.',
      });
    }
  }

  const intent = top?.label;

  try {
    let response,
      extra = '';
    switch (intent) {
      case 'obtener_reportes_usuarios':
        response = await axios.get(
          `${API_BASE}/user/obtener-reportes-usuarios`
        );
        if (response.data.usuarios?.length > 0) {
          extra = formatList(response.data.usuarios);
        }
        return res.json({
          respuesta: `✅ ${response.data.message}. Se encontraron ${
            response.data.usuarios?.length || 0
          } usuarios reportados.${extra}`,
        });

      case 'obtener_usuarios_no_admin':
        response = await axios.get(
          `${API_BASE}/user/obtener-usuarios-no-admin`
        );
        if (response.data.usuarios?.length > 0) {
          extra = formatList(response.data.usuarios);
        }
        return res.json({
          respuesta: `✅ ${response.data.message}. Hay ${
            response.data.usuarios?.length || 0
          } usuarios sin permisos de administrador.${extra}`,
        });

      case 'ver_todas_promociones':
        response = await axios.get(
          `${API_BASE}/promotion/obtener-todas-promociones`
        );
        if (response.data.promociones?.length > 0) {
          extra = formatList(response.data.promociones);
        }
        return res.json({
          respuesta: `✅ ${response.data.message}. Se han recuperado ${
            response.data.promociones?.length || 0
          } promociones.${extra}`,
        });

      case 'ver_productos':
        response = await axios.get(`${API_BASE}/product/obtener-productos`);
        if (response.data.productos?.length > 0) {
          extra = formatList(response.data.productos);
        }
        return res.json({
          respuesta: `✅ ${response.data.message}. Hay ${
            response.data.productos?.length || 0
          } productos disponibles.${extra}`,
        });

      case 'ver_todas_ordenes':
        response = await axios.get(`${API_BASE}/orders/obtenerTodasOrdenes`);
        if (response.data.ordenes?.length > 0) {
          extra = formatList(response.data.ordenes);
        }
        return res.json({
          respuesta: `✅ ${response.data.message}. Se han registrado ${
            response.data.ordenes?.length || 0
          } órdenes en total.${extra}`,
        });

      default:
        return res.json({
          respuesta:
            'Esta versión del chatbot no es capaz de responder esta solicitud. Por favor usa la aplicación directamente.',
        });
    }
  } catch (error) {
    console.error('Error al consumir microservicio:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Chatbot backend escuchando en http://localhost:${PORT}`);
});
