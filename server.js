const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// BASE_PATH permite que la app funcione en subdirectorios como /DemoDockploy
// Por defecto es '/', pero puede ser configurado con la variable de entorno BASE_PATH
const BASE_PATH = process.env.BASE_PATH || '';

// Configuración de PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'demouser',
  password: process.env.DB_PASSWORD || 'demopass',
  database: process.env.DB_NAME || 'demodb',
  port: process.env.DB_PORT || 5432,
});

// Inicializar base de datos
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS titles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insertar título por defecto si la tabla está vacía
    const result = await pool.query('SELECT COUNT(*) FROM titles');
    if (parseInt(result.rows[0].count) === 0) {
      await pool.query(
        'INSERT INTO titles (title) VALUES ($1)',
        ['¡Hola Mundo desde Docker MODIFICADO!']
      );
      console.log('✅ Título por defecto insertado en la BD');
    }

    console.log('✅ Conectado a PostgreSQL');
  } catch (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
  }
}

initDatabase();

// Middleware para servir archivos estáticos desde la carpeta public
app.use(BASE_PATH, express.static(path.join(__dirname, 'public')));

// Ruta principal - Hello World con título editable
app.get(BASE_PATH + '/', async (req, res) => {
  try {
    // Obtener el título de la BD
    const result = await pool.query('SELECT title FROM titles ORDER BY id DESC LIMIT 1');
    const currentTitle = result.rows[0]?.title || '¡Hola Mundo desde Docker!';

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
        .edit-section {
          background: #e8f0fe;
          padding: 1.5rem;
          border-radius: 10px;
          margin-top: 2rem;
        }
        .edit-section h3 {
          color: #667eea;
          margin-bottom: 1rem;
        }
        input[type="text"] {
          width: 100%;
          padding: 0.8rem;
          border: 2px solid #667eea;
          border-radius: 5px;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        button {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }
        button:hover {
          background: #764ba2;
        }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .message {
          margin-top: 1rem;
          padding: 0.8rem;
          border-radius: 5px;
          display: none;
        }
        .message.success {
          background: #d4edda;
          color: #155724;
          display: block;
        }
        .message.error {
          background: #f8d7da;
          color: #721c24;
          display: block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🐳</div>
        <h1 id="pageTitle">${currentTitle}</h1>
        <p class="subtitle">Demo de Dockploy - IT-DAG</p>
        
        <div class="edit-section">
          <h3>✏️ Editar Título</h3>
          <input type="text" id="newTitle" placeholder="Nuevo título..." value="${currentTitle}">
          <button onclick="updateTitle()" id="saveBtn">Guardar</button>
          <div id="message" class="message"></div>
        </div>
        
        <div class="info-box">
          <h3>📊 Información del Servidor</h3>
          <div class="info-item"><strong>Base Path:</strong> ${BASE_PATH || '/'}</div>
          <div class="info-item"><strong>Puerto:</strong> ${PORT}</div>
          <div class="info-item"><strong>Node.js:</strong> ${process.version}</div>
          <div class="info-item"><strong>Plataforma:</strong> ${process.platform}</div>
          <div class="info-item"><strong>Hostname:</strong> ${require('os').hostname()}</div>
          <div class="info-item"><strong>Base de Datos:</strong> PostgreSQL 🐘</div>
        </div>
        
        <div class="info-box">
          <h3>✅ Estado</h3>
          <div class="info-item">La aplicación está funcionando correctamente en Docker</div>
          <div class="info-item">Desplegada con Dockploy</div>
          <div class="info-item">Conectada a PostgreSQL</div>
        </div>
      </div>
      
      <script>
        async function updateTitle() {
          const newTitle = document.getElementById('newTitle').value;
          const saveBtn = document.getElementById('saveBtn');
          const message = document.getElementById('message');
          
          if (!newTitle.trim()) {
            message.textContent = '❌ El título no puede estar vacío';
            message.className = 'message error';
            return;
          }
          
          saveBtn.disabled = true;
          saveBtn.textContent = 'Guardando...';
          message.style.display = 'none';
          
          try {
            const response = await fetch('${BASE_PATH}/api/title', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ title: newTitle })
            });
            
            const data = await response.json();
            
            if (response.ok) {
              document.getElementById('pageTitle').textContent = data.title;
              message.textContent = '✅ Título actualizado correctamente';
              message.className = 'message success';
            } else {
              throw new Error(data.error || 'Error al actualizar');
            }
          } catch (error) {
            message.textContent = '❌ Error: ' + error.message;
            message.className = 'message error';
          } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Guardar';
          }
        }
      </script>
    </body>
    </html>
  `);
  } catch (err) {
    console.error('Error obteniendo título:', err);
    res.status(500).send('Error del servidor');
  }
});

// Ruta de salud para Docker health checks
app.get(BASE_PATH + '/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    basePath: BASE_PATH
  });
});

// API: Obtener título actual
app.get(BASE_PATH + '/api/title', async (req, res) => {
  try {
    const result = await pool.query('SELECT title FROM titles ORDER BY id DESC LIMIT 1');
    const title = result.rows[0]?.title || '¡Hola Mundo desde Docker!';
    res.json({ title });
  } catch (err) {
    console.error('Error obteniendo título:', err);
    res.status(500).json({ error: 'Error al obtener el título' });
  }
});

// API: Actualizar título
app.post(BASE_PATH + '/api/title', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'El título no puede estar vacío' });
    }

    await pool.query(
      'INSERT INTO titles (title) VALUES ($1)',
      [title.trim()]
    );

    res.json({ success: true, title: title.trim() });
  } catch (err) {
    console.error('Error actualizando título:', err);
    res.status(500).json({ error: 'Error al actualizar el título' });
  }
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
