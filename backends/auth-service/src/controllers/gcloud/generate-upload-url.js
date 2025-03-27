const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  keyFilename: './service-account.json', // archivo de credenciales de cuenta de servicio
  projectId: process.env.GCLOUD_PROJECT_ID,
});

BUCKET_NAME = 'software-avanzado-bucket';

const generateUploadUrl = async (req, res) => {
  const filename = req.query.filename;
  const contentType = req.query.contentType || 'application/octet-stream';

  if (!filename) {
    return res.status(400).json({ error: 'Falta el nombre del archivo (filename)' });
  }

  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(filename);

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutos
      contentType,
    });

    res.json({ url });
  } catch (error) {
    console.error('Error al generar URL firmada:', error);
    res.status(500).json({ error: 'Error interno al generar la URL firmada' });
  }
};

module.exports = { generateUploadUrl };
