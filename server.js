const express = require('express');
const path = require('path');

const app = express();

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// BASE_PATH permite que la app funcione en subdirectorios como /DemoDockploy
// Por defecto es '/', pero puede ser configurado con la variable de entorno BASE_PATH
const BASE_PATH = process.env.BASE_PATH || '';

// Middleware para servir archivos estáticos desde la carpeta public
app.use(BASE_PATH, express.static(path.join(__dirname, 'public')));

// Ruta principal - Hello World
app.get(BASE_PATH + '/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Demo Dockploy</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .container {
          background: white;
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          text-align: center;
          max-width: 600px;
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        h1 {
          color: #667eea;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .subtitle {
          color: #666;
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }
        .info-box {
          background: #f5f5f5;
          padding: 1.5rem;
          border-radius: 10px;
          margin-top: 2rem;
          text-align: left;
        }
        .info-box h3 {
          color: #764ba2;
          margin-bottom: 1rem;
        }
        .info-item {
          margin: 0.5rem 0;
          color: #333;
        }
        .info-item strong {
          color: #667eea;
        }
        .logo {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🐳</div>
        <h1>¡Hola Mundo desde Docker!</h1>
        <p class="subtitle">Demo de Dockploy - IT-DAG</p>
        
        <div class="info-box">
          <h3>📊 Información del Servidor</h3>
          <div class="info-item"><strong>Base Path:</strong> ${BASE_PATH || '/'}</div>
          <div class="info-item"><strong>Puerto:</strong> ${PORT}</div>
          <div class="info-item"><strong>Node.js:</strong> ${process.version}</div>
          <div class="info-item"><strong>Plataforma:</strong> ${process.platform}</div>
          <div class="info-item"><strong>Hostname:</strong> ${require('os').hostname()}</div>
        </div>
        
        <div class="info-box">
          <h3>✅ Estado</h3>
          <div class="info-item">La aplicación está funcionando correctamente en Docker</div>
          <div class="info-item">Desplegada con Dockploy</div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Ruta de salud para Docker health checks
app.get(BASE_PATH + '/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    basePath: BASE_PATH
  });
});

// Ruta API de ejemplo
app.get(BASE_PATH + '/api/info', (req, res) => {
  res.json({
    message: 'API funcionando correctamente',
    basePath: BASE_PATH,
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
  if (BASE_PATH) {
    console.log(`📁 Base path configurado: ${BASE_PATH}`);
  }
  console.log(`✅ Health check disponible en: http://0.0.0.0:${PORT}${BASE_PATH}/health`);
});
